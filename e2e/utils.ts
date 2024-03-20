import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
import detect from "detect-port";

export async function setupE2eTest() {
  await startSupabase();
  reseedDb();
}

async function startSupabase() {
  const port = await detect(54321);
  if (port !== 54321) {
    return;
  }
  console.warn("Supabase not detected - Starting it now");
  execSync("npx supabase start");

}

function reseedDb() {
  const output = execSync('npx supabase status -o env').toString();
  const regex = /(?<=SERVICE_ROLE_KEY=")[^"]*/;
  const match = output.match(regex);

  console.log(output)

  if (match) {
    console.log(match[0]); // This will log 'desired_string' to the console
    const serviceKey = match[0]
    const client = createClient('http://127.0.0.1:54321', serviceKey);

    seedUsers(client)
  } else {
    console.log('No match found');
  }



}

async function seedUsers(client: SupabaseClient) {
  const { data, error } = await client.auth.admin.listUsers()

  const users = [
    { email: 'user1@balelos.com', password: 'password123' },
    // Add more users as needed
  ];

  
  // Clear the users
  if (data.users.length > 0) {
    for (const user of data.users) {
      const {data, error } = await client.auth.admin.deleteUser(user.id)
      if(error) {
        // console.error('Error deleting user:', user.email, error);
        break;
      }
      console.log("Deleted User: ", user.email)
    }
  }

  for (const user of users) {
    const { data, error } = await client.auth.admin.createUser({email_confirm: true, ...user})
    if(error) {
      // console.error('Error seeding user:', user.email, error);
      continue;
    }

    console.log('Seeded user:', data.user.email);
  }
}
