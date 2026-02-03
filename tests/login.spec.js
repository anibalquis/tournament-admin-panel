import { test, expect } from '@playwright/test';

// Test data
const VALID_EMAIL = 'euhaeshi2@gmail.com';
const VALID_PASSWORD = 'Admin@2025-2';
const INVALID_PASSWORD = '123';
const UNREGISTERED_EMAIL = 'pepito123@gmail.com';

// Helper function to wait for toast notification
async function waitForToast(page, messagePattern) {
  // Sonner toasts have data-sonner-toast attribute
  // The message can be a string or regex for flexible matching
  const toastRegion = page.locator('[data-sonner-toaster]');
  
  if (typeof messagePattern === 'string') {
    const toast = toastRegion.getByText(messagePattern);
    await expect(toast).toBeVisible({ timeout: 15000 });
    return toast;
  } else {
    const toast = toastRegion.getByText(messagePattern);
    await expect(toast).toBeVisible({ timeout: 15000 });
    return toast;
  }
}

// Helper to wait for any error toast to appear
async function waitForAnyErrorToast(page) {
  const toastRegion = page.locator('[data-sonner-toaster]');
  const errorToast = toastRegion.locator('[data-type="error"]');
  await expect(errorToast).toBeVisible({ timeout: 15000 });
  return errorToast;
}

// Clear storage before each test to ensure isolation
test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test.describe('Login Page - Initial Load', () => {
  test('should display all login form elements correctly', async ({ page }) => {
    await page.goto('/');
    
    // Clear storage after page loads
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Verify main title
    await expect(page.getByRole('heading', { name: 'ROBOTECH', level: 1 })).toBeVisible();

    // Verify subtitle
    await expect(page.getByRole('heading', { name: /Acceso de Administrador/i })).toBeVisible();

    // Verify email input is visible and accessible
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Verify password input is visible and has correct type
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Verify login button
    const loginButton = page.getByRole('button', { name: /ingresar/i });
    await expect(loginButton).toBeVisible();

    // Verify footer text
    await expect(page.getByText('© 2025 Robotech Security. Todos los derechos reservados.')).toBeVisible();

    // Verify "Recordarme" checkbox
    await expect(page.locator('#remember')).toBeVisible();

    // Verify "¿Olvidaste tu contraseña?" link
    await expect(page.getByText('¿Olvidaste tu contraseña?')).toBeVisible();
  });
});

test.describe('Login Page - Successful Login', () => {
  test('should login successfully and redirect to panel-admin', async ({ page }) => {
    await page.goto('/');
    
    // Clear storage after page loads
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page.waitForLoadState('networkidle');

    // Fill in valid credentials
    await page.locator('#email').fill(VALID_EMAIL);
    await page.locator('#password').fill(VALID_PASSWORD);

    // Click login button
    await page.getByRole('button', { name: /ingresar/i }).click();

    // Wait for navigation to panel-admin
    await expect(page).toHaveURL(/.*\/panel-admin/, { timeout: 15000 });

    // Verify "Panel Principal" text is visible on the dashboard
    await expect(page.getByText('Panel Principal')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Login Page - Error Scenarios', () => {
  test('should show error toast for incorrect password', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill in valid email with incorrect password
    await page.locator('#email').fill(VALID_EMAIL);
    await page.locator('#password').fill(INVALID_PASSWORD);

    // Click login button
    await page.getByRole('button', { name: /ingresar/i }).click();

    // Wait for an error toast to appear
    // The message could be "Contraseña incorrecta" or a similar error from the backend
    await waitForAnyErrorToast(page);

    // Verify we're still on login page
    await expect(page).toHaveURL('/');
  });

  test('should show error toast for unregistered email', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill in unregistered email
    await page.locator('#email').fill(UNREGISTERED_EMAIL);
    await page.locator('#password').fill('anypassword123');

    // Click login button
    await page.getByRole('button', { name: /ingresar/i }).click();

    // Wait for an error toast to appear
    // The message could be "Correo no encontrado" or a similar error from the backend
    await waitForAnyErrorToast(page);

    // Verify we're still on login page
    await expect(page).toHaveURL('/');
  });

  test('should show error toast for empty fields', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click login button without filling any fields
    await page.getByRole('button', { name: /ingresar/i }).click();

    // Verify error toast appears with correct message (this one is client-side)
    await waitForToast(page, 'Todos los campos son obligatorios');

    // Verify we're still on login page
    await expect(page).toHaveURL('/');
  });

  test('should show error toast when only email is filled', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill only email
    await page.locator('#email').fill(VALID_EMAIL);

    // Click login button
    await page.getByRole('button', { name: /ingresar/i }).click();

    // Verify error toast appears (client-side validation)
    await waitForToast(page, 'Todos los campos son obligatorios');
  });

  test('should show error toast when only password is filled', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill only password
    await page.locator('#password').fill(VALID_PASSWORD);

    // Click login button
    await page.getByRole('button', { name: /ingresar/i }).click();

    // Verify error toast appears (client-side validation)
    await waitForToast(page, 'Todos los campos son obligatorios');
  });
});

test.describe('Login Page - Password Field Behavior', () => {
  test('password field should toggle visibility when clicking eye icon', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.locator('#password');
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Fill password to see the toggle effect
    await passwordInput.fill('testpassword');

    // Click the eye icon button (it's inside the password field container)
    const toggleButton = page.locator('#password').locator('..').locator('button');
    await toggleButton.click();
    
    // Password should now be visible (type="text")
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    await toggleButton.click();
    
    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Login Page - Navigation', () => {
  test('should navigate to password recovery page when clicking forgot password link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click forgot password link
    await page.getByText('¿Olvidaste tu contraseña?').click();

    // Verify navigation to password recovery page
    await expect(page).toHaveURL(/.*\/recuperar-contrasena/);
  });
});

test.describe('Login Page - Accessibility', () => {
  test('should be navigable by keyboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Focus on email field and type
    await page.locator('#email').focus();
    await page.keyboard.type(VALID_EMAIL);

    // Tab to password field and type
    await page.keyboard.press('Tab');
    await page.keyboard.type(VALID_PASSWORD);

    // Verify email was filled
    await expect(page.locator('#email')).toHaveValue(VALID_EMAIL);
    
    // Verify password was filled
    await expect(page.locator('#password')).toHaveValue(VALID_PASSWORD);
  });

  test('email and password labels should be properly associated with inputs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check email label association
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();

    // Check password label association
    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toBeVisible();
  });
});
