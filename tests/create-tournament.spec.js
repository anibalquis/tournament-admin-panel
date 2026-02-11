import { test, expect } from '@playwright/test';

// ============================================================================
// DATA
// ============================================================================
const VALID_EMAIL = 'euhaeshi2@gmail.com';
const VALID_PASSWORD = 'Admin@2025-2';

// Valid tournament data for successful creation
const VALID_TOURNAMENT = {
  name: 'Torneo Nacional 2024',
  description: 'Campeonato nacional de robots',
  category: 'Lucha destructiva',
  judge: 'Andrea Paola Salazar Medina',
  startDate: '2025-06-15',
  clubs: [
    'Iron Mechanics',
    'RoboTitans',
    'Steel Minds',
    'Mecha Warriors',
    'Cyber Claws',
    'Quantum Bots',
    'Neo Circuit',
    'Omega Robotics',
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Wait for a Sonner toast notification with a specific message.
 * Supports string or regex patterns.
 */
async function waitForToast(page, messagePattern) {
  const toastRegion = page.locator('[data-sonner-toaster]');
  const toast = toastRegion.getByText(messagePattern);
  await expect(toast).toBeVisible({ timeout: 15000 });
  return toast;
}

// Wait for any error-type toast notification to appear.
async function waitForAnyErrorToast(page) {
  const toast = page.locator('[data-sonner-toast]');
  await expect(toast.first()).toBeVisible({ timeout: 15000 });
  return toast;
}

// Authenticate as admin user and wait for redirect to dashboard.
async function loginAsAdmin(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.waitForLoadState('networkidle');

  await page.locator('#email').fill(VALID_EMAIL);
  await page.locator('#password').fill(VALID_PASSWORD);
  await page.getByRole('button', { name: /ingresar/i }).click();

  await expect(page).toHaveURL(/.*\/panel-admin/, { timeout: 15000 });
  await expect(page.getByText('Panel Principal')).toBeVisible({ timeout: 10000 });
}

// Navigate to the Torneos section via the sidebar menu.
async function navigateToTorneos(page) {
  await page.getByRole('button', { name: /torneos/i }).click();
  await expect(page).toHaveURL(/.*\/panel-admin\/torneos/, { timeout: 10000 });
  await expect(
    page.getByRole('heading', { name: /Gestión de Torneos/i })
  ).toBeVisible({ timeout: 10000 });
}

// Open the "Create Tournament" modal and wait for data to load.
async function openCreateModal(page) {
  await page.getByRole('button', { name: /Nuevo Torneo/i }).click();

  // Wait for modal heading
  await expect(
    page.getByRole('heading', { name: /Crear Nuevo Torneo/i })
  ).toBeVisible({ timeout: 10000 });

  /**
   * Wait for form to load (loading spinner disappears and form fields appear)
   * The category combobox appears only after data finishes loading
   */
  await expect(
    page.getByRole('combobox').filter({ hasText: /Seleccionar categoría/ })
  ).toBeVisible({ timeout: 15000 });
}

// Get the modal overlay container.
function getModal(page) {
  return page.locator('.fixed.inset-0').first();
}

async function fillTournamentForm(page, data = {}) {
  const modal = getModal(page);

  if (data.name !== undefined) {
    await modal.getByPlaceholder('Ej: RoboCup 2025').fill(data.name);
  }

  if (data.description !== undefined) {
    await modal.getByPlaceholder('Descripción opcional del torneo...').fill(data.description);
  }

  if (data.category !== undefined) {
    const allSelects = modal.locator('form select');
    await allSelects.nth(0).selectOption({ label: data.category });
  }

  if (data.judge !== undefined) {
    const allSelects = modal.locator('form select');
    await allSelects.nth(1).selectOption({ label: data.judge });
  }

  if (data.startDate !== undefined) {
    const dateInputs = modal.locator('input[type="date"]');
    await dateInputs.nth(0).fill(data.startDate);
  }

  if (data.endDate !== undefined) {
    const dateInputs = modal.locator('input[type="date"]');
    await dateInputs.nth(1).fill(data.endDate);
  }

  if (data.participants !== undefined) {
    const allSelects = modal.locator('form select');
    await allSelects.nth(2).selectOption(data.participants.toString());
  }

  if (data.combatDuration !== undefined) {
    await modal.locator('input[type="number"]').fill(data.combatDuration.toString());
  }
}

/**
 * Select clubs in the club selector slots.
 * Club selects start from index 3 in the form's select elements
 * (0=category, 1=judge, 2=participants, 3..N=clubs).
 */
async function selectClubs(page, clubNames) {
  const modal = getModal(page);
  const allSelects = modal.locator('form select');

  // Club selects start at index 3
  for (let i = 0; i < clubNames.length; i++) {
    await allSelects.nth(3 + i).selectOption({ label: clubNames[i] });
  }
}

// Click the "Crear Torneo" submit button in the modal footer.
async function clickSubmitButton(page) {
  const modal = getModal(page);
  const buttons = modal.getByRole('button', { name: /Crear Torneo/i });
  await buttons.last().click();
}

// Click the "Cancelar" button in the modal footer.
async function clickCancelButton(page) {
  const modal = getModal(page);
  await modal.getByRole('button', { name: /Cancelar/i }).click();
}

// ============================================================================
// TESTS
// ============================================================================


// Escenario 1: Autenticación y navegación
test.describe('Escenario 1: Autenticación y Navegación', () => {

  test('should redirect unauthenticated users to login when accessing /panel-admin/torneos', async ({ page }) => {
    await page.goto('/panel-admin/torneos');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('should login and navigate to torneos page successfully', async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
    await expect(
      page.getByRole('button', { name: /Nuevo Torneo/i })
    ).toBeVisible();
  });

  test('should display the create modal with all form elements', async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
    await openCreateModal(page);

    // Verify modal heading
    await expect(
      page.getByRole('heading', { name: /Crear Nuevo Torneo/i })
    ).toBeVisible();

    // Verify label texts are present
    await expect(page.getByText('Nombre del Torneo *')).toBeVisible();
    await expect(page.getByLabel('Descripción')).toBeVisible();
    await expect(page.getByText('Categoría *')).toBeVisible();
    await expect(page.getByText('Juez *')).toBeVisible();
    await expect(page.getByText('Fecha de Inicio')).toBeVisible();
    await expect(page.getByText('Número de Participantes *')).toBeVisible();
    await expect(page.getByText(/Seleccionar Clubes Participantes/)).toBeVisible();

    // Verify action buttons
    await expect(page.getByRole('button', { name: /Cancelar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Crear Torneo/i }).last()).toBeVisible();
  });
});


// Escenario 2: Validaciones de campos obligatorios
test.describe('Escenario 2: Validaciones de Campos Obligatorios', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
    await openCreateModal(page);
  });

  test('should block form submission when required fields are empty (HTML5 validation)', async ({ page }) => {
    // Click submit without filling anything — HTML5 required should block
    await clickSubmitButton(page);

    // Modal should remain open because HTML5 validation prevents submission
    await expect(
      page.getByRole('heading', { name: /Crear Nuevo Torneo/i })
    ).toBeVisible();
  });

  test('should show API error for short tournament name', async ({ page }) => {
    await fillTournamentForm(page, {
      name: 'aa',
      category: VALID_TOURNAMENT.category,
      judge: VALID_TOURNAMENT.judge,
    });
    await selectClubs(page, VALID_TOURNAMENT.clubs);
    await clickSubmitButton(page);

    await waitForAnyErrorToast(page);

    // Modal should still be open
    await expect(
      page.getByRole('heading', { name: /Crear Nuevo Torneo/i })
    ).toBeVisible();
  });

  test('should show API error for very long tournament name', async ({ page }) => {
    const longName = 'A'.repeat(150);

    await fillTournamentForm(page, {
      name: longName,
      category: VALID_TOURNAMENT.category,
      judge: VALID_TOURNAMENT.judge,
    });
    await selectClubs(page, VALID_TOURNAMENT.clubs);
    await clickSubmitButton(page);

    await waitForAnyErrorToast(page);
  });
});


// Escenario 3: Validación de dependencia Categoría-Juez
test.describe('Escenario 3: Validación Categoría-Juez', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
    await openCreateModal(page);
  });

  test('should populate category dropdown with available categories', async ({ page }) => {
    const modal = getModal(page);
    const categorySelect = modal.locator('form select').nth(0);

    // Should have placeholder + at least one real category
    const optionCount = await categorySelect.locator('option').count();
    expect(optionCount).toBeGreaterThan(1);

    // Verify known categories exist
    const options = await categorySelect.locator('option').allTextContents();
    expect(options).toContain('Lucha destructiva');
  });

  test('should populate judge dropdown with available judges', async ({ page }) => {
    const modal = getModal(page);
    const judgeSelect = modal.locator('form select').nth(1);

    const optionCount = await judgeSelect.locator('option').count();
    expect(optionCount).toBeGreaterThan(1);
  });

  test('should show API error when judge does not match tournament category', async ({ page }) => {
    // Select category and a judge that doesn't belong to it
    // "Rosa Elena Huamán Tapia" is assigned to "Mini Sumo", not "Lucha destructiva"
    await fillTournamentForm(page, {
      name: 'Torneo Test Juez Inválido',
      category: 'Lucha destructiva',
      judge: 'Rosa Elena Huamán Tapia',
    });

    await selectClubs(page, VALID_TOURNAMENT.clubs);
    await clickSubmitButton(page);

    // API should return error about judge-category mismatch
    await waitForAnyErrorToast(page);
  });
});


// Escenario 4: Validación de clubes participantes
test.describe('Escenario 4: Validación de Clubes Participantes', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
    await openCreateModal(page);
  });

  test('should show API error when submitting with unapproved club', async ({ page }) => {
    // "Robot Masters" is listed in the dropdown but is NOT approved
    await fillTournamentForm(page, {
      name: 'Torneo Club No Aprobado',
      category: VALID_TOURNAMENT.category,
      judge: VALID_TOURNAMENT.judge,
    });

    // Select Robot Masters in slot 1, then fill remaining 7 slots with valid clubs
    const modal = getModal(page);
    const allSelects = modal.locator('form select');
    await allSelects.nth(3).selectOption({ label: 'Robot Masters' });

    // Fill slots 2-8 with valid clubs
    const validClubs = VALID_TOURNAMENT.clubs.slice(0, 7);
    for (let i = 0; i < validClubs.length; i++) {
      await allSelects.nth(4 + i).selectOption({ label: validClubs[i] });
    }

    await clickSubmitButton(page);

    // API should return error about unapproved club
    await waitForAnyErrorToast(page);
  });

  test('should show API error when fewer than 8 clubs are selected', async ({ page }) => {
    await fillTournamentForm(page, {
      name: 'Torneo Pocos Clubes',
      category: VALID_TOURNAMENT.category,
      judge: VALID_TOURNAMENT.judge,
    });

    // Select only 4 of 8 required clubs
    const partialClubs = VALID_TOURNAMENT.clubs.slice(0, 4);
    await selectClubs(page, partialClubs);

    await clickSubmitButton(page);

    await waitForAnyErrorToast(page);
  });

  test('should filter out already-selected clubs from other dropdowns (UI duplicate prevention)', async ({ page }) => {
    const modal = getModal(page);
    const allSelects = modal.locator('form select');

    // Get initial option count in club slot 1 (index 3)
    const slot1 = allSelects.nth(3);
    const initialOptionCount = await slot1.locator('option').count();

    // Select "Iron Mechanics" in slot 1
    await slot1.selectOption({ label: 'Iron Mechanics' });

    // Check that slot 2 (index 4) does NOT offer "Iron Mechanics"
    const slot2 = allSelects.nth(4);
    const slot2Options = await slot2.locator('option').allTextContents();
    const hasDuplicate = slot2Options.some((text) => text.trim() === 'Iron Mechanics');

    expect(
      hasDuplicate,
      '"Iron Mechanics" should not appear in slot 2 after being selected in slot 1'
    ).toBe(false);

    // Slot 2 should have one fewer option than slot 1 had originally
    const slot2OptionCount = await slot2.locator('option').count();
    expect(slot2OptionCount).toBe(initialOptionCount - 1);
  });
});


// Escenario 5: Creación exitosa de torneo
test.describe('Escenario 5: Creación Exitosa de Torneo', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
  });

  test('should create a tournament successfully with all valid data', async ({ page }) => {
    await openCreateModal(page);

    // Fill the complete form
    await fillTournamentForm(page, {
      name: VALID_TOURNAMENT.name,
      description: VALID_TOURNAMENT.description,
      category: VALID_TOURNAMENT.category,
      judge: VALID_TOURNAMENT.judge,
      startDate: VALID_TOURNAMENT.startDate,
    });

    // Select all 8 clubs
    await selectClubs(page, VALID_TOURNAMENT.clubs);

    // Submit the form
    await clickSubmitButton(page);

    // Wait for success toast
    await waitForToast(page, /[Tt]orneo creado/);

    // Modal should close
    await expect(
      page.getByRole('heading', { name: /Crear Nuevo Torneo/i })
    ).not.toBeVisible({ timeout: 10000 });

    // Verify the tournament appears in the table
    await expect(page.getByRole('cell', { name: VALID_TOURNAMENT.name }).first()).toBeVisible({
      timeout: 10000,
    });
  });
});


// Escenario 6: Validación de fechas y datos numéricos
test.describe('Escenario 6: Validación de Datos y Fechas', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
    await openCreateModal(page);
  });

  test('should show API error when start date is in the past', async ({ page }) => {
    await fillTournamentForm(page, {
      name: 'Torneo Fecha Pasada',
      category: VALID_TOURNAMENT.category,
      judge: VALID_TOURNAMENT.judge,
      startDate: '2020-01-01',
    });

    await selectClubs(page, VALID_TOURNAMENT.clubs);
    await clickSubmitButton(page);

    await waitForAnyErrorToast(page);
  });

  // Note: "Participants" is a <select> with only 8 and 16 as options.
  // There's no free-text input, so invalid values (0, 8.5, negative) can't be entered.
  test('should only offer valid participant counts (8 or 16)', async ({ page }) => {
    const modal = getModal(page);
    const participantsSelect = modal.locator('form select').nth(2);
    const options = await participantsSelect.locator('option').allTextContents();

    expect(options).toHaveLength(2);
    expect(options.some((o) => o.includes('8'))).toBe(true);
    expect(options.some((o) => o.includes('16'))).toBe(true);
  });
});


// Escenario 7: Cancelar operación
test.describe('Escenario 7: Cancelar Operación', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
  });

  test('should close the modal without creating tournament when clicking "Cancelar"', async ({ page }) => {
    await openCreateModal(page);

    // Partially fill the form
    await fillTournamentForm(page, {
      name: 'Torneo que será cancelado',
      description: 'No debería guardarse',
    });

    // Click cancel
    await clickCancelButton(page);

    // Modal should be closed
    await expect(
      page.getByRole('heading', { name: /Crear Nuevo Torneo/i })
    ).not.toBeVisible({ timeout: 5000 });

    // URL should still be torneos
    await expect(page).toHaveURL(/.*\/panel-admin\/torneos/);

    // The cancelled tournament should NOT appear in the table
    await expect(page.getByText('Torneo que será cancelado')).not.toBeVisible();
  });

  test('should close the modal when clicking the X close button', async ({ page }) => {
    await openCreateModal(page);

    // Click the X button (aria-label="Cerrar modal")
    await page.getByLabel('Cerrar modal').click();

    await expect(
      page.getByRole('heading', { name: /Crear Nuevo Torneo/i })
    ).not.toBeVisible({ timeout: 5000 });
  });
});


// Escenario Extra: Accesibilidad básica
test.describe('Accesibilidad Básica del Formulario', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToTorneos(page);
    await openCreateModal(page);
  });

  test('should have visible labels for all form fields', async ({ page }) => {
    const labels = [
      'Nombre del Torneo *',
      'Categoría *',
      'Juez *',
      'Fecha de Inicio',
      'Fecha de Fin',
      'Número de Participantes *',
      'Duración del Combate (seg)',
    ];

    for (const label of labels) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test('should support keyboard navigation through form fields', async ({ page }) => {
    const modal = getModal(page);

    // Focus on name input and type
    const nameInput = modal.getByPlaceholder('Ej: RoboCup 2025');
    await nameInput.focus();
    await page.keyboard.type('Torneo Teclado');

    // Tab to description textarea
    await page.keyboard.press('Tab');
    await page.keyboard.type('Descripción por teclado');

    // Verify values were entered correctly
    await expect(nameInput).toHaveValue('Torneo Teclado');
    await expect(
      modal.getByPlaceholder('Descripción opcional del torneo...')
    ).toHaveValue('Descripción por teclado');
  });
});
