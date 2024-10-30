import test, { expect } from "@playwright/test";
import { login } from "../auth/utils";
import { testConstants } from "../utils";

test.describe("organizations Management", () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3000');
        
        if (page.url() === 'http://localhost:3000/login') {
            console.log("Logging in");
            await login(page, testConstants.usersEmails[0], testConstants.usersPasswords[0])
        }
    })

    test('Authenticated User should have a default organization on the home page', async ({page}) => {
        expect(page).toHaveURL('http://localhost:3000')
        const orgCards = page.locator('.org-card')
        await expect(orgCards).toHaveCount(2)
        const orgCard = orgCards.first()
        await expect(orgCard.locator('p').first()).toHaveText('My Org')
        orgCard.click()
        await page.waitForURL('http://localhost:3000/my/')
        await expect(page).toHaveURL('http://localhost:3000/my/')

        const orgDropdown = page.locator('#teams-dropdown')
        await expect(orgDropdown).toBeAttached()
    });
    test('Admin should be able to create new Orgs', async ({page}) => {
        expect(page).toHaveURL('http://localhost:3000')
        const createOrgButton = page.locator('#create-org-button')
        const orgCards = page.locator('.org-card')
        await expect(orgCards).toHaveCount(2)
        await createOrgButton.click()
        const modal = page.locator('#create-org-modal')
        await expect(modal).toBeAttached()
        await modal.locator('input[type=text]').fill('My new Org')
        const createButton = modal.locator('button[type=submit]')
        await createButton.click()
        await page.waitForSelector('.org-card')
        await expect(orgCards).toHaveCount(3)

        orgCards.last().click()
        await page.waitForURL('http://localhost:3000/my/')
        await expect(page).toHaveURL('http://localhost:3000/my/')

        const orgDropdown = page.locator('#teams-dropdown')
        await expect(orgDropdown).toBeAttached()
    });
});