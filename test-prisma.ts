/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
try {
  console.log("Testing no args");
  new PrismaClient();
  console.log("No args OK");
} catch (e: any) {
  console.log("No args failed:", e.message);
}
try {
  console.log("Testing empty object");
  new PrismaClient({});
  console.log("Empty object OK");
} catch (e: any) {
  console.log("Empty object failed:", e.message);
}
try {
  console.log("Testing datasource");
  new (PrismaClient as any)({ datasourceUrl: process.env.DATABASE_URL });
  console.log("datasource OK");
} catch (e: any) {
  console.log("datasource failed:", e.message);
}
try {
  console.log("Testing adapter null");
  new (PrismaClient as any)({ adapter: null });
  console.log("adapter null OK");
} catch (e: any) {
  console.log("adapter null failed:", e.message);
}
