import test from "@playwright/test";
import { login } from "../auth/utils";
import { testConstants } from "../utils";


test.describe("Student Management", () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3000');
        
        if (page.url() === 'http://localhost:3000/login') {
            console.log("Logging in");
            await login(page, testConstants.usersEmails[0], testConstants.usersPasswords[0])
        }
    })

    test('Org should have a default Student on the home page', async ({page}) => {});

    test('Admins can create new Students', async ({page}) => {});

    test('Admins can edit Students', async ({page}) => {});

    test('Admins can delete Students', async ({page}) => {});

    test('Admins can assign Students to Courses', async ({page}) => {});
});

