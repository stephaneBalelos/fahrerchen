import { execSync } from "child_process";
import detect from "detect-port";

export const testConstants = {
  usersEmails: [
    'owner1@organisation1.com',
    'owner2@organisation2.com',
    'manager1@organisation1.com',
    'manager2@organisation2.com',
  ],
  usersPasswords: [
    'password',
    'password',
    'password',
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

function reseedDb() {
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
