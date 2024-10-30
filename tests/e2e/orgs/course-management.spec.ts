import test, { expect } from "@playwright/test";
import { login } from "../auth/utils";
import { selectFromSelectMenu, testConstants } from "../utils";


test.describe("Course Management", () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3000');

        console.log(page.url());
        
        if (page.url() == 'http://localhost:3000/login') {
            console.log("Logging in");
            await login(page, testConstants.usersEmails[0], testConstants.usersPasswords[0])
            await page.waitForTimeout(1000);
        }
    })

    test('Org should have a default Course on the home page', async ({page}) => {
        await page.goto('http://localhost:3000/my/courses');
        await expect(page.url()).toBe('http://localhost:3000/my/courses');
        await page.waitForSelector('.course-card');
        await expect(page.locator('.course-card').first()).toBeVisible();
    });

    test('Admins can create new Courses', async ({page}) => {
        await page.goto('http://localhost:3000/my/courses');
        const header = await page.locator('.courses-header')
        const createCourseButton = header.locator('button')
        await createCourseButton.click();
        await page.waitForSelector('#create-course-slideover');
        const modal = page.locator('#create-course-slideover');
        await expect(modal).toBeVisible();
        await modal.locator('input[type=text]').fill('My new Course');
        const select = modal.locator('.app-select');
        await selectFromSelectMenu(page, select, 6);
        await modal.locator('textarea').fill('This is a new course');
        const createButton = modal.locator('.app-btn-submit');
        await createButton.click();

        const notificationsContainer = page.locator("#notifications-container")
        await expect(notificationsContainer).toBeAttached()
        const toast = page.locator('#notifications-container > div')
        await expect(toast).toHaveCount(1, {timeout: 1000})

        await page.waitForURL(/^(http:\/\/localhost:3000\/my\/courses\/)(.+?)\/settings/)
        const regex = /^(http:\/\/localhost:3000\/my\/courses\/)(.+?)\/settings/
        expect(page).toHaveURL(regex)

    });

    test('Admins can edit Courses', async ({page}) => {});

    test('Admins can delete Courses', async ({page}) => {});

    test('Admins can assign Courses to Users', async ({page}) => {});


});