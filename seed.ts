/**
 * ! Executing this script will delete all data in your database and seed it with 10 auth_users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";

const main = async () => {
  const seed = await createSeedClient({dryRun: true});

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 10 auth_users

  await seed.auth_users((x) => x(10, {
    instance_id: "00000000-0000-0000-0000-000000000000",
    aud: 'authenticated',
    role: 'authenticated',
    email_confirmed_at: new Date(),
    raw_app_meta_data: {"provider":"email","providers":["email"]},
    raw_user_meta_data: {},
    created_at: new Date(),
  }))

  await seed.identities((x) => x(10, (ctx) => {
    const auth_user = seed.$store.auth_users[ctx.index];
    return {
      user_id: seed.$store.auth_users[ctx.index].id,
      identity_data: {"sub": `${auth_user.id}`},
      provider: "email",
      created_at: auth_user.created_at,
  }}))

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes


  process.exit();
};

main();