import { test, expect } from '@playwright/test';

// ─── Test Data ───────────────────────────────────────────────────────────────
const VALID_EMAIL = 'euhaeshi2@gmail.com';
const VALID_PASSWORD = 'Admin@2025-2';

const BLOQUEOS_URL = '/panel-admin/bloqueos';

const TEST_USER_ID = '21';
const NONEXISTENT_USER_ID = '99999';
const BLOCK_REASON = 'Realizar trampas en el torneo ID 30';

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Log in as admin and navigate to the bloqueos panel.
 * Reuses the same login flow as login.spec.js.
 */
async function loginAsAdmin(page) {
    await page.goto('/');

    // Clear storage for isolation
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    await page.waitForLoadState('networkidle');

    // Fill credentials and submit
    await page.locator('#email').fill(VALID_EMAIL);
    await page.locator('#password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /ingresar/i }).click();

    // Wait for successful redirect to the admin panel
    await expect(page).toHaveURL(/.*\/panel-admin/, { timeout: 15000 });
}

/**
 * Navigate to the bloqueos panel and wait for the table to load.
 */
async function navigateToBloqueos(page) {
    await page.goto(BLOQUEOS_URL);
    await page.waitForLoadState('networkidle');

    // Wait for loading spinner to disappear and the heading to be visible
    await expect(
        page.getByRole('heading', { name: /Gestión de Bloqueos/i })
    ).toBeVisible({ timeout: 10000 });
}

/**
 * Wait for a Sonner toast with the specified text to appear.
 * Returns the located toast element.
 */
async function waitForToast(page, messagePattern) {
    const toastRegion = page.locator('[data-sonner-toaster]');

    const toast = toastRegion.getByText(messagePattern);
    await expect(toast).toBeVisible({ timeout: 15000 });
    return toast;
}

/**
 * Wait for any Sonner warning toast to appear.
 */
async function waitForWarningToast(page) {
    const toastRegion = page.locator('[data-sonner-toaster]');
    const warningToast = toastRegion.locator('[data-type="warning"]');
    await expect(warningToast).toBeVisible({ timeout: 15000 });
    return warningToast;
}

/**
 * Wait for any Sonner error toast to appear.
 */
async function waitForErrorToast(page) {
    const toastRegion = page.locator('[data-sonner-toaster]');
    const errorToast = toastRegion.locator('[data-type="error"]');
    await expect(errorToast).toBeVisible({ timeout: 15000 });
    return errorToast;
}

/**
 * Wait for any Sonner success toast to appear.
 */
async function waitForSuccessToast(page) {
    const toastRegion = page.locator('[data-sonner-toaster]');
    const successToast = toastRegion.locator('[data-type="success"]');
    await expect(successToast).toBeVisible({ timeout: 15000 });
    return successToast;
}

/**
 * Open the "Registrar Bloqueo" modal by clicking the header button.
 */
async function openCreateBlockModal(page) {
    await page.getByRole('button', { name: /Registrar Bloqueo/i }).click();

    // Wait for the modal heading to appear
    await expect(
        page.getByRole('heading', { name: /Registrar Bloqueo/i })
    ).toBeVisible({ timeout: 5000 });
}

/**
 * Fill the create-block form fields.
 */
async function fillCreateBlockForm(page, { userId, reason }) {
    const modal = page.locator('.fixed.inset-0');

    if (userId !== undefined && userId !== '') {
        await modal.locator('input[type="number"]').fill(String(userId));
    }

    if (reason !== undefined) {
        await modal.locator('textarea').fill(reason);
    }
}

/**
 * Click the "Guardar" button inside the currently open modal.
 */
async function clickSave(page) {
    const modal = page.locator('.fixed.inset-0');
    await modal.getByRole('button', { name: /Guardar/i }).click();
}

/**
 * Open the "Editar Bloqueo" modal for the first row that matches a given
 * condition. Clicks the pencil (edit) icon button in that row.
 */
async function openEditBlockModal(page) {
    // Click the first edit button visible in the table
    const editButton = page.locator('table button[title="Editar bloqueo"]').first();
    await editButton.click();

    // Wait for the modal heading to appear
    await expect(
        page.getByRole('heading', { name: /Editar Bloqueo/i })
    ).toBeVisible({ timeout: 5000 });
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page, context }) => {
    // Clear cookies for session isolation
    await context.clearCookies();

    // Login and navigate to bloqueos panel
    await loginAsAdmin(page);
    await navigateToBloqueos(page);
});

// ─── Test Suite: Bloquear Usuario ────────────────────────────────────────────

test.describe('Bloquear Usuario', () => {
    test('should show warning toast when blocking with a nonexistent user ID', async ({ page }) => {
        await openCreateBlockModal(page);

        await fillCreateBlockForm(page, {
            userId: NONEXISTENT_USER_ID,
            reason: BLOCK_REASON,
        });

        await clickSave(page);

        // The API should return an error since the user doesn't exist
        const errorToast = await waitForErrorToast(page);
        await expect(errorToast).toContainText(/usuario no encontrado|no se pudo crear|error/i);
    });

    test('should show warning toast when blocking without a reason', async ({ page }) => {
        await openCreateBlockModal(page);

        await fillCreateBlockForm(page, {
            userId: TEST_USER_ID,
            reason: '',
        });

        await clickSave(page);

        // Client-side validation: "El motivo del bloqueo es requerido."
        const toast = await waitForToast(page, 'El motivo del bloqueo es requerido.');
        await expect(toast).toBeVisible();
    });

    test('should show warning toast when blocking without a user ID', async ({ page }) => {
        await openCreateBlockModal(page);

        // Only fill reason, leave user ID empty
        await fillCreateBlockForm(page, {
            userId: '',
            reason: BLOCK_REASON,
        });

        await clickSave(page);

        // Client-side validation: "El ID del usuario es requerido."
        const toast = await waitForToast(page, 'El ID del usuario es requerido.');
        await expect(toast).toBeVisible();
    });

    test('should successfully block a user and show success toast', async ({ page }) => {
        await openCreateBlockModal(page);

        await fillCreateBlockForm(page, {
            userId: TEST_USER_ID,
            reason: BLOCK_REASON,
        });

        await clickSave(page);

        // Wait for success toast
        const successToast = await waitForSuccessToast(page);
        await expect(successToast).toContainText(/bloqu|creado|correctamente/i);

        // Verify the modal has closed
        await expect(
            page.getByRole('heading', { name: /Registrar Bloqueo/i })
        ).not.toBeVisible({ timeout: 5000 });
    });
});

// ─── Test Suite: Reactivar Cuenta de Usuario ─────────────────────────────────

test.describe('Reactivar Cuenta de Usuario', () => {
    test('should show warning toast when saving edit without selecting a status', async ({ page }) => {
        // Open the edit modal for the first blocked user in the table
        await openEditBlockModal(page);

        // Do NOT change the status dropdown — leave it at its current value or "Seleccionar estado"
        // First reset to empty to simulate "no selection"
        const modal = page.locator('.fixed.inset-0');
        await modal.locator('select').selectOption('');

        await clickSave(page);

        // Client-side validation: "Debe seleccionar un estado."
        const toast = await waitForToast(page, 'Debe seleccionar un estado.');
        await expect(toast).toBeVisible();
    });

    test('should successfully unblock a user and show success toast', async ({ page }) => {
        // Open the edit modal for the first user in the table
        await openEditBlockModal(page);

        // Change the status to "Desbloqueado" (value: "lifted")
        const modal = page.locator('.fixed.inset-0');
        await modal.locator('select').selectOption('lifted');

        await clickSave(page);

        // Wait for success toast
        const successToast = await waitForSuccessToast(page);
        await expect(successToast).toContainText(/actualizado|desbloqueado|correctamente/i);

        // Verify the modal has closed
        await expect(
            page.getByRole('heading', { name: /Editar Bloqueo/i })
        ).not.toBeVisible({ timeout: 5000 });
    });
});

// ─── Test Suite: Accessibility ───────────────────────────────────────────────

test.describe('Bloqueos - Accessibility', () => {
    test('create block form should be navigable by keyboard', async ({ page }) => {
        await openCreateBlockModal(page);

        const modal = page.locator('.fixed.inset-0');
        const userIdInput = modal.locator('input[type="number"]');
        const reasonTextarea = modal.locator('textarea');

        // Focus user ID field and type
        await userIdInput.focus();
        await page.keyboard.type('10');
        await expect(userIdInput).toHaveValue('10');

        // Tab to reason field and type
        await page.keyboard.press('Tab');
        await page.keyboard.type('Test reason');
        await expect(reasonTextarea).toHaveValue('Test reason');
    });

    test('form labels should be present and visible', async ({ page }) => {
        await openCreateBlockModal(page);

        // Verify labels for create form
        await expect(page.getByText('ID del Usuario *')).toBeVisible();
        await expect(page.getByText('Motivo del bloqueo *')).toBeVisible();
    });
});
