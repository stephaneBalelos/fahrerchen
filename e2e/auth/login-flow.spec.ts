import { test, expect } from '@playwright/test';
import { setupE2eTest } from '../utils';
import { login } from './utils';

test.describe('Auth Flow', () => {
    const userEmailWrong = "test@test.io";
    const userPasswordWrong = "test123456";
    const userEmail = "user1@balelos.com";
    const userPassword = "password123";
    test.beforeAll(setupE2eTest);
    test.beforeEach(async ({ page }) => {
      // Go to the starting url before each test.
      await page.goto('http://localhost:3000');
    });
  
    test('not authenticated user are redirected to login', async ({ page }) => {
      // Assertions use the expect API.
      await expect(page).toHaveURL('http://localhost:3000/login');
    });

    test('login with wrong credentials should fail', async ({page}) => {
        await expect(page).toHaveURL('http://localhost:3000/login');
        await login(page, userEmailWrong, userPasswordWrong)
        await expect(page).toHaveURL('http://localhost:3000/login')
    })
    test('login with correct credentials should not fail', async ({page, context}) => {
        await expect(page).toHaveURL('http://localhost:3000/login')

        // await page.waitForEvent('load')

        await login(page, userEmail, userPassword)

        await page.waitForURL('http://localhost:3000')
    })
    test('authenticated user is redirected to home page after login', async ({ page }) => {
        await expect(page).toHaveURL('http://localhost:3000/login');
        await login(page, userEmail, userPassword);
        await page.waitForURL('http://localhost:3000')    });
  });