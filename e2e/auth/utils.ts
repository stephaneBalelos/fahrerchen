import { expect, type Page } from "@playwright/test";

export async function login(
    page: Page,
    email: string,
    password: string,
    loginButtonSelector = 'button[type="submit"]',
) {
    await page.waitForTimeout(3000)
    const signUpButton = page
        .locator(loginButtonSelector)
        .first();
    expect(signUpButton).toBeAttached()
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill(email);
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill(password);
    await signUpButton.click()

}