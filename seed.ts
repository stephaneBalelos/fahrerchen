import { createSeedClient, type app_roleEnum, type ModelCallbackContext } from "@snaplet/seed";
import { copycat } from "@snaplet/copycat"
import { testConstants } from "./tests/e2e/utils";
import { createHash } from "crypto";
import * as bcrypt from 'bcrypt';

// Im generating a seed file to populate the database with some data for testing purposes
// If someone sees this, please tell me if i'm doing it right


const main = async () => {
  const seed = await createSeedClient({dryRun: true});

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 2 auth_users they will be admins because there's no org_id and role set ind raw_user_meta_data
  await seed.auth_users((x) => x(4, (ctx) => {
    return getUserSeedData(ctx);
  }))
  await seed.identities((x) => x(4, (ctx) => {
    const auth_user = seed.$store.auth_users[ctx.index];
    return {
      user_id: seed.$store.auth_users[ctx.index].id,
      identity_data: {"sub": `${auth_user.id}`},
      provider: "email",
      provider_id: auth_user.id,
      created_at: auth_user.created_at,
  }}))

  // Seed the corresponding organisations (2 organisations are normally already created by pg triggers when a new user is created, but we dont have that here so we need to create them manually)
  await seed.organisations((x) => x(2, (ctx) => {
    const auth_user = seed.$store.auth_users[ctx.index];
    return {
      name: "Organisation " + ctx.index,
      owner_id: auth_user.id,
      created_at: new Date(),
    }
  }))

  // Seed the organisation_members table with the auth_users we created
  const managers = testConstants.usersEmails.filter((email) => email.includes('manager'))
  for (let i = 0; i < managers.length; i++) {
    const auth_user = seed.$store.auth_users.find((user) => user.email === managers[i]);
    if (auth_user) {
      await seed.organisation_members((x) => x(1, (ctx) => {
        {
          return {
            user_id: auth_user.id,
            organisation_id: seed.$store.organisations[0].id,
            role: 'manager',
            created_at: new Date(),
          }
        }
      }))
    }
  }
  // seed 2 students in the first created organisation
  await seed.students((x) => x(2, (ctx) => {
    const org = seed.$store.organisations[0];
    return {
      firstname: copycat.firstName(ctx.index),
      lastname: copycat.lastName(ctx.index),
      email: copycat.email(ctx.index),
      birth_date: copycat.dateString(ctx.index, {minYear: 1990, maxYear: 2005}),
      organisation_id: org.id,
      created_at: new Date(),
    }
  }))

  // seed 2 courses in all organisations
  const orgs = seed.$store.organisations;
  for (let i = 0; i < orgs.length; i++) {
    await seed.courses((x) => x(2, (ctx) => {
      return {
        name: "Course " + ctx.index,
        description: copycat.sentence(ctx.index),
        organisation_id: orgs[i].id,
        created_at: new Date(),
        type: copycat.int(i + ctx.index, {min: 1, max: 9,}),
      }
    }))
    }

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes
  process.exit();
};

// Helper function to run the main function
function getUserSeedData(ctx: ModelCallbackContext & {index: number}, orgId?: string, role?: app_roleEnum) {
  return {
    instance_id: "00000000-0000-0000-0000-000000000000",
    aud: 'authenticated',
    role: 'authenticated',
    email: testConstants.usersEmails[ctx.index],
    encrypted_password: bcrypt.hashSync('password', 2),
    email_confirmed_at: new Date(),
    raw_app_meta_data: {"provider":"email","providers":["email"]},
    raw_user_meta_data: {"orgid": orgId ? `${orgId}`: null, "role": role ? `${role}`: null},
    created_at: new Date(),
  }
}

main();