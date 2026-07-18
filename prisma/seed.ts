import { createClient } from "@supabase/supabase-js";
import { UserRole } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const users = [
  {
    email: "ops@example.com",
    password: "password123",
    role: "ops_manager",
    fullName: "Demo Ops Manager",
  },
  {
    email: "security@example.com",
    password: "password123",
    role: "security",
    fullName: "Demo Security Officer",
  },
  {
    email: "volunteer@example.com",
    password: "password123",
    role: "volunteer",
    fullName: "Demo Volunteer",
  },
];

async function seed() {
  console.log("Seeding Supabase auth.users and Prisma users...");

  for (const u of users) {
    let authUser;

    // Check if user exists by trying to list users
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("Error listing users:", listError);
      continue;
    }

    const existing = existingUsers.users.find((user) => user.email === u.email);

    if (existing) {
      console.log(`User ${u.email} already exists in auth.users. Updating password...`);
      await supabase.auth.admin.updateUserById(existing.id, { password: u.password });
      authUser = existing;
    } else {
      console.log(`Creating user ${u.email} in auth.users...`);
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`Failed to create ${u.email}:`, error);
        continue;
      }
      authUser = data.user;
    }

    if (authUser) {
      await prisma.user.upsert({
        where: { id: authUser.id },
        update: {
          role: u.role as UserRole,
          full_name: u.fullName,
        },
        create: {
          id: authUser.id,
          role: u.role as UserRole,
          full_name: u.fullName,
          preferred_language: "en",
        },
      });
      console.log(`Successfully synced ${u.email} to Prisma users.`);
    }
  }

  console.log("Seeding completed.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
