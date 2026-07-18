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

  const articles = [
    {
      title: "Medical Emergency SOP",
      slug: "medical-emergency-sop",
      category: "Emergency",
      audience: ["volunteer", "operations"],
      keywords: ["medical", "emergency", "injury", "first aid", "ambulance"],
      content_markdown:
        "# Medical Emergency SOP\n\nIf a fan requires medical assistance:\n1. Secure the area and ensure no further danger.\n2. Do NOT move the injured person unless they are in immediate peril.\n3. Contact Operations Center immediately and request medical team.\n4. Stay with the person until help arrives.",
    },
    {
      title: "Lost Child Procedure",
      slug: "lost-child-procedure",
      category: "Safety",
      audience: ["volunteer", "operations", "public"],
      keywords: ["lost child", "missing", "parent", "found", "code adam"],
      content_markdown:
        "# Lost Child Procedure\n\nIf a child is reported lost or a lost child is found:\n1. Notify security immediately (Code Adam).\n2. Escort the child or reporting parent to the nearest Help Desk.\n3. Note description, clothing, and last seen location.\n4. Do not make public announcements unless authorized by Operations.",
    },
    {
      title: "Accessibility Assistance",
      slug: "accessibility-assistance",
      category: "Guest Services",
      audience: ["volunteer", "operations", "public"],
      keywords: ["accessibility", "wheelchair", "disabled", "ramp", "assistance"],
      content_markdown:
        "# Accessibility Assistance\n\nVolunteers should proactively offer help to guests with mobility or sensory needs.\n- Direct wheelchair users to designated elevators and ramps.\n- Offer assistance with wayfinding to accessible seating.\n- Contact Guest Services if specialized equipment is needed.",
    },
    {
      title: "Ticket Validation Policy",
      slug: "ticket-validation-policy",
      category: "Entry",
      audience: ["volunteer", "operations"],
      keywords: ["ticket", "validation", "scanner", "invalid", "entry"],
      content_markdown:
        "# Ticket Validation Policy\n\nAll attendees must have a valid ticket scanned at the gate.\n- If a scanner fails, direct the fan to the manual resolution desk.\n- Confiscate obvious counterfeit physical tickets and report to Security.\n- No re-entry is permitted once a ticket is scanned.",
    },
    {
      title: "Stadium Entry Guidelines",
      slug: "stadium-entry-guidelines",
      category: "Entry",
      audience: ["public", "volunteer", "operations"],
      keywords: ["entry", "gates", "bags", "prohibited items", "security check"],
      content_markdown:
        "# Stadium Entry Guidelines\n\nWelcome to the stadium! Please adhere to the following:\n- Clear bags only, maximum size 12x6x12 inches.\n- No outside food or beverages.\n- All guests must pass through metal detectors.\n- Have your digital ticket open and ready before reaching the gate.",
    },
    {
      title: "Volunteer Conduct",
      slug: "volunteer-conduct",
      category: "HR",
      audience: ["volunteer"],
      keywords: ["conduct", "behavior", "uniform", "breaks", "rules"],
      content_markdown:
        "# Volunteer Conduct\n\nAs a volunteer, you represent the organization.\n- Always wear your designated uniform and credential.\n- Remain polite and helpful at all times.\n- Take breaks only in designated volunteer areas.\n- Do not ask players or VIPs for autographs.",
    },
    {
      title: "Crowd Guidance",
      slug: "crowd-guidance",
      category: "Safety",
      audience: ["volunteer", "operations"],
      keywords: ["crowd", "congestion", "bottleneck", "flow", "directions"],
      content_markdown:
        "# Crowd Guidance\n\nTo ensure smooth movement:\n- Monitor pinch points (escalators, narrow concourses).\n- Politely ask fans to keep moving and not block walkways.\n- During egress, proactively direct fans to the nearest available exit.\n- Report severe congestion to the Operations Center immediately.",
    },
  ];

  console.log("Seeding Knowledge Articles...");
  for (const article of articles) {
    await prisma.knowledgeArticle.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        category: article.category,
        audience: article.audience as import("@prisma/client").Audience[],
        keywords: article.keywords,
        content_markdown: article.content_markdown,
      },
      create: {
        title: article.title,
        slug: article.slug,
        category: article.category,
        audience: article.audience as import("@prisma/client").Audience[],
        keywords: article.keywords,
        content_markdown: article.content_markdown,
      },
    });
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
