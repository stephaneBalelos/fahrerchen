import type { Locator, Page } from "@playwright/test";
import { execSync } from "child_process";
import detect from "detect-port";

export const testConstants = {
  usersEmails: [
    'stephanedondyas2@gmail.com',

  ],
  usersPasswords: [
    'password',
  ]
}

export async function setupE2eTest() {
  await startSupabase();
  // reseedDb();
}

async function startSupabase() {
  const port = await detect(54321);
  if (port !== 54321) {
    return;
  }
  console.warn("Supabase not detected - Starting it now");
  execSync("supabase start");
  console.log("Supabase started");
  execSync("supabase db reset");

}

function _reseedDb() {
  execSync("supabase db reset");

  // const cp = exec("supabase db reset");
  // const p = new Promise((resolve, reject) => {
  //   cp.on("exit", (code) => {
  //     if (code === 0) {
  //       console.log("Database reset");
  //       resolve(true);
  //     } else {
  //       console.error("Database reset failed");
  //       reject(false);
  //     }
  //   });
  // });
  // return p;
}


export async function selectFromSelectMenu(page: Page, selectMenu: Locator, option: number) {
  await selectMenu.click();
  await page.waitForSelector('.app-select-menu');
  await page.waitForSelector('.app-select-menu-option');
  const options = await page.locator('.app-select-menu-option').all();
  await options[option].click();
}
