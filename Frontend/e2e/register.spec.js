import { test, expect } from '@playwright/test'

const registerUrl = '/register'
const authRoute = '**/auth/register'

test.describe('E2E - Registro de nuevo cliente en EcoMart', () => {
  test('Registro exitoso con datos válidos', async ({ page }) => {
    await page.route(authRoute, route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 123,
            nombre: 'Juan Pérez',
            email: 'juan.perez+e2e@example.com',
          },
          message: 'Cuenta creada exitosamente',
        }),
      })
    )

    await page.goto(registerUrl)
    await page.fill('input[name="nombre"]', 'Juan Pérez')
    await page.fill('input[name="email"]', 'juan.perez+e2e@example.com')
    await page.fill('input[name="password"]', 'Password1!')
    await page.fill('input[name="confirmPassword"]', 'Password1!')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.locator('.auth-error')).toHaveCount(0)
  })

  test('Registro fallido por correo ya existente', async ({ page }) => {
    await page.route(authRoute, route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'El correo ya está registrado',
        }),
      })
    )

    await page.goto(registerUrl)
    await page.fill('input[name="nombre"]', 'Ana Gómez')
    await page.fill('input[name="email"]', 'ana.gomez+existing@example.com')
    await page.fill('input[name="password"]', 'Password1!')
    await page.fill('input[name="confirmPassword"]', 'Password1!')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/register$/)
    await expect(page.locator('.auth-error')).toHaveText('El correo ya está registrado')
  })

  test('Registro fallido por correo inválido', async ({ page }) => {
    await page.route(authRoute, route =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Formato de correo inválido',
        }),
      })
    )

    await page.goto(registerUrl)
    await page.fill('input[name="nombre"]', 'Carlos Ruiz')
    await page.fill('input[name="email"]', 'correo-invalido')
    await page.fill('input[name="password"]', 'Password1!')
    await page.fill('input[name="confirmPassword"]', 'Password1!')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/register$/)
    await expect(page.locator('.auth-error')).toHaveText('Formato de correo inválido')
  })

  test('Registro fallido por contraseñas no coinciden', async ({ page }) => {
    await page.goto(registerUrl)
    await page.fill('input[name="nombre"]', 'María López')
    await page.fill('input[name="email"]', 'maria.lopez@example.com')
    await page.fill('input[name="password"]', 'Password1!')
    await page.fill('input[name="confirmPassword"]', 'Password2!')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/register$/)
    await expect(page.locator('.auth-error')).toHaveText('Las contraseñas no coinciden')
  })

  test('Registro fallido por campos obligatorios vacíos', async ({ page }) => {
    await page.goto(registerUrl)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/register$/)
    await expect(page.locator('.auth-error')).toHaveText('Por favor completa todos los campos')
  })
})
