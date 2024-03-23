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
  execSync("supabase start");

}

function reseedDb() {
  const output = execSync('supabase status -o env').toString();
  const regex = /(?<=SERVICE_ROLE_KEY=")[^"]*/;
  const match = output.match(regex);

  if (match) { // This will log 'desired_string' to the console
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


  for (const user of users) {
    await seedDefaultUser({client, ...user})
  }
}


const seedDefaultUser = async ({client, email, password}: {client: SupabaseClient, email: string, password: string}) => {
  const {data, error} = await client.auth.admin.createUser({email_confirm: true, email: email, password: password})
  if (error) {
    return;
  }
  
}
