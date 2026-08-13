// ==============================================
// Database Seed
// ==============================================
// Yo script pahilo choti database setup garda euta choti chalaune ho.
// Yesले default section types (Registration, VAT) ra default sectors
// (Road, Bridge, Structure, Water Supply, Sanitation) automatically banaidinxa.
//
// Chalaune command: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Default document sections (static - Registration, VAT)
  const defaultSections = [
    { key: "registration", label: "Company Registration Certificate" },
    { key: "vat", label: "VAT Registration" },
  ];

  for (const section of defaultSections) {
    await prisma.documentSectionType.upsert({
      where: { key: section.key },
      update: {},
      create: { ...section, isDefault: true },
    });
  }

  // Default sectors for Experience Letters
  const defaultSectors = ["Road", "Bridge", "Structure", "Water Supply", "Sanitation"];

  for (const sectorName of defaultSectors) {
    await prisma.sector.upsert({
      where: { name: sectorName },
      update: {},
      create: { name: sectorName },
    });
  }

  console.log("✅ Seed complete: default sections and sectors created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
