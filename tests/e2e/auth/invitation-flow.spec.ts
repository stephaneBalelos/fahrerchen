import { test, expect } from '@playwright/test';
import { setupE2eTest, testConstants } from '../utils';
import { login } from './utils';

test.describe("Invite Team Member in organization", () => {

    test.beforeAll(setupE2eTest);
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3000');
        
        if (page.url() === 'http://localhost:3000/login') {
            console.log("Logging in");
            await login(page, testConstants.usersEmails[0], testConstants.usersPasswords[0])
        }

        
    })

    test('Authenticated User should have a default organization on the home page', async ({page, context: _}) => {
        expect(page).toHaveURL('http://localhost:3000/my');
        const orgCards = page.locator('.org-card')
        await expect(orgCards).toHaveCount(1)
        const orgCard = orgCards.first()
        await expect(orgCard.locator('p').first()).toHaveText('Fahrschule Weser')
        await orgCard.locator('.org-card-action').click()
        await page.waitForURL(/http:\/\/localhost:3000\/my\/.+/)

        const orgDropdown = page.locator('#teams-dropdown')
        await expect(orgDropdown).toBeAttached()

        const orgName = orgDropdown.locator('span.truncate').first()
        await expect(orgName).toHaveText('Fahrschule Weser')
    })

    test('Authenticated User should be able to invite a team member to the organization', async ({page, context: _}) => {
        expect(page).toHaveURL('http://localhost:3000/my');
        const orgCard = page.locator('.org-card').first()
        const buttonLink = orgCard.locator('.org-card-action')
        await expect(buttonLink).toBeAttached()
        await buttonLink.click()
        await page.waitForURL(/http:\/\/localhost:3000\/my\/.+/)

        

        await page.locator('#invite-people').click()

        const form = page.locator("#add-member-form")
        await expect(form).toBeVisible()

        await form.locator("input[name=email]").fill("user1@manager.test.com")
        // await form.locator("input[name]").fill("user1@manager.test.com")

        await form.locator("button[type='submit']").click()

        const notificationsContainer = page.locator("#notifications-container")
        await expect(notificationsContainer).toBeAttached()
        const toast = page.locator('#notifications-container > div')
        await expect(toast).toHaveCount(1, {timeout: 1000})
    })
})