import { test, expect } from '@playwright/test';
import { setupE2eTest } from '../utils';
import { login } from './utils';
import { a } from 'vitest/dist/suite-UrZdHRff.js';

test.describe("Invite Team Member in Organisation", () => {

    test.beforeAll(setupE2eTest);
    test.beforeEach(async ({page}) => {
        await login(page, "user1@test.com", "password123")
    })

    test('Authenticated User should have a default Organisation on the home page', async ({page, context}) => {
        expect(page).toHaveURL('http://localhost:3000')
        const orgCards = page.locator('.org-card')
        await expect(orgCards).toHaveCount(1)
        const orgCard = orgCards.first()
        await expect(orgCard.locator('p').first()).toHaveText('My Org')
        orgCard.click()
        await page.waitForURL('http://localhost:3000/my/')
        await expect(page).toHaveURL('http://localhost:3000/my/')

        const orgName = page.locator('.org-dropdown')
        await expect(orgName).toHaveText('My Org')
    })

    test('Authenticated User should be able to invite a team member to the organisation', async ({page, context}) => {
        expect(page).toHaveURL('http://localhost:3000')
        page.locator('.org-card').first().click()
        await page.waitForURL('http://localhost:3000/my/')
        await expect(page).toHaveURL('http://localhost:3000/my/')

        await page.goto('http://localhost:3000/my/settings/members')
        await page.waitForURL('http://localhost:3000/my/settings/members')
        await expect(page).toHaveURL('http://localhost:3000/my/settings/members')

        await page.locator('button[#invite-member]').click()

        const form = page.locator("#add-member-form")
        await expect(form).toBeVisible()

        await form.locator("input[name]").fill("user1@manager.test.com")
        // await form.locator("input[name]").fill("user1@manager.test.com")

        await form.locator("button[type='submit']").click()

        const successToas = page.locator('div[role="alert"]')
        await expect(successToas).toBeAttached()


    })
})