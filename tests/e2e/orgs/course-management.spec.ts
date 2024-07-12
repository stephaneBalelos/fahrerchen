import test from "@playwright/test";
import { login } from "../auth/utils";
import { testConstants } from "../utils";


test.describe("Course Management", () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3000');
        
        if (page.url() === 'http://localhost:3000/login') {
            console.log("Logging in");
            await login(page, testConstants.usersEmails[0], testConstants.usersPasswords[0])
        }
    })

    test('Org should have a default Course on the home page', async ({page}) => {});

    test('Admins can create new Courses', async ({page}) => {});

    test('Admins can edit Courses', async ({page}) => {});

    test('Admins can delete Courses', async ({page}) => {});

    test('Admins can assign Courses to Users', async ({page}) => {});


});