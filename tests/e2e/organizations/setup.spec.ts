import { test, expect } from '@playwright/test';
import { setupE2eTest, testConstants } from '../utils';
import { login } from '../auth/utils';

test.describe("Setup Organization", () => {

    test.beforeAll(setupE2eTest);
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3000');
        
        if (page.url() === 'http://localhost:3000/login') {
            console.log("Logging in");
            await login(page, testConstants.usersEmails[0], testConstants.usersPasswords[0])
        }
    })

    test('Authenticated User should be able to create an organization', async ({page, context: _}) => {
        expect(page).toHaveURL('http://localhost:3000/my');

        // Find button to create organization
        const createOrgButton = page.locator('#create-organization');
        await expect(createOrgButton).toBeAttached();
        await createOrgButton.click();

        // Expect to modal to be visible
        const form = page.locator("#create-organization-form")
        await expect(form).toBeVisible()

        // Fill the form
        await form.locator("input[name=name]").fill("Fahrschule Weser")
        await form.locator("input[name=phone]").fill("+491234567890")
        await form.locator("input[name=address_street]").fill("Musterstraße 1")
        await form.locator("input[name=address_city]").fill("Bremen")
        await form.locator("input[name=address_zip]").fill("28195")
        await form.locator("input[name=address_country]").fill("Deutschland")
        
        // Submit the form
        await form.locator("button[type=submit]").click();

        // Wait for the modal to close
        await expect(form).toBeHidden();

        // Expect to see the organization card
        const orgCard = page.locator(".organization-card", {hasText: "Fahrschule Weser"}).first();
        await expect(orgCard).toBeVisible();

        // Continue setup
        const continueSetupButton = orgCard.locator('[data-label="continue-setup"]');
        await expect(continueSetupButton).toBeVisible();
        await continueSetupButton.click();

        // Expect to be on the organization setup page https://example.com/setup/:orgId
        await expect(page).toHaveURL(/\/setup\/.+/);

    })

    test('AUthenticated User should be able able to setup organization', async ({page, context: _}) => {
        expect(page).toHaveURL('http://localhost:3000/my');

        // Find the organization card
        const orgCard = page.locator(".organization-card").first();
        await expect(orgCard).toBeVisible();

        // Continue setup
        const continueSetupButton = orgCard.locator('[data-label="continue-setup"]');
        await expect(continueSetupButton).toBeVisible();
        await continueSetupButton.click();

        // Expect to be on the organization setup page https://example.com/setup/:orgId
        await expect(page).toHaveURL(/\/setup\/.+/);

        // Go through the setup steps
        // 1. Details (skip, as we are already here)
        const nextStepButton1 = page.locator('[data-label="next-step"]');
        await expect(nextStepButton1).toBeVisible();
        await nextStepButton1.click();

        // 2. Courses
        expect(page).toHaveURL(/\/setup\/.+\/courses/);
        const nextStepButton2 = page.locator('[data-label="next-step"]');
        await expect(nextStepButton2).not.toBeVisible(); // Should not be visible yet
        const activateCourseButtons = page.locator('button[data-label="activate-course"]');
        expect(activateCourseButtons).not.toHaveCount(0);
        await activateCourseButtons.first().click();
        await expect(nextStepButton2).toBeVisible();
        await nextStepButton2.click();

        // 3. Activities
        expect(page).toHaveURL(/\/setup\/.+\/activities/);
        const generateDefaultActivitiesButton = page.locator('button[data-label="generate-default-activities"]');
        await expect(generateDefaultActivitiesButton).toBeVisible();
        await generateDefaultActivitiesButton.click();
        await expect(generateDefaultActivitiesButton).toBeHidden();
        const nextStepButton3 = page.locator('[data-label="next-step"]');
        await expect(nextStepButton3).toBeVisible();
        await nextStepButton3.click();

        // 4. Costs
        expect(page).toHaveURL(/\/setup\/.+\/costs/);
        const generateDefaultCostsButton = page.locator('button[data-label="generate-default-costs"]');
        await expect(generateDefaultCostsButton).toBeVisible();
        await generateDefaultCostsButton.click();
        await expect(generateDefaultCostsButton).toBeHidden();
        const nextStepButton4 = page.locator('[data-label="next-step"]');
        await expect(nextStepButton4).toBeVisible();
        await nextStepButton4.click();

        // 5. Billing
        expect(page).toHaveURL(/\/setup\/.+\/billing/);
        const nextStepButton5 = page.locator('[data-label="next-step"]');
        await expect(nextStepButton5).toBeVisible();
        await nextStepButton5.click();
        // Todo: Add more interactions to setup billing details

        // 6. Required Documents
        expect(page).toHaveURL(/\/setup\/.+\/required-documents/);
        const generateDefaultDocumentsButton = page.locator('button[data-label="generate-default-documents"]');
        await expect(generateDefaultDocumentsButton).toBeVisible();
        await generateDefaultDocumentsButton.click();
        await expect(generateDefaultDocumentsButton).toBeHidden();
        const nextStepButton6 = page.locator('[data-label="next-step"]');
        await expect(nextStepButton6).toBeVisible();
        await nextStepButton6.click();

        // Expect to be on the completed setup page
        await expect(page).toHaveURL(/\/setup\/.+\/complete/);

        // Go to organization dashboard
        const goToOrgButton = page.locator('[data-label="go-to-organization"]');
        await expect(goToOrgButton).toBeVisible();
        await goToOrgButton.click();

        // Expect to be on the organization dashboard
        await expect(page).toHaveURL(/\/my\/.+/);

    });    
})