// ==============================================
// Prisma Client Singleton
// ==============================================
// KINA YO CHAHINXA:
// Vercel jasto "serverless" platform ma, harek request le naya function
// instance chalauna sakxa. Yedi har request ma naya PrismaClient() banayeyo
// bhane, dherai database connection khulera database नै "connection limit"
// vanने error dinxa (ERG platform ma yehi problem vayeko thiyo).
//
// Yo file le euta "singleton" pattern use garxa - matlab development ma
// euta matra PrismaClient instance banaera reuse garxa, naya-naya nabanaudai.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
