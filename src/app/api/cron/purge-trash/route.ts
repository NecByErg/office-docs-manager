// ==============================================
// Trash Auto-Purge Cron Job
// ==============================================
// Yo route Vercel Cron le harek din automatically call garxa (vercel.json ma schedule set garieko).
// Kaam: 30 din bhanda pahila trash ma gaeko document haru PURAI (permanently) delete garne.
//
// Security: Vercel Cron bahek arू le call garna nasakos vanera CRON_SECRET check garxa.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/blobStorage";

export async function GET(request: NextRequest) {
  // Vercel Cron le request ma yo header automatically pathaunxa
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const cutoff = { isDeleted: true, deletedAt: { lte: thirtyDaysAgo } };

  const [staticDocs, taxClearances, experienceLetters] = await Promise.all([
    prisma.companyDocument.findMany({ where: cutoff }),
    prisma.taxClearance.findMany({ where: cutoff }),
    prisma.experienceLetter.findMany({ where: cutoff }),
  ]);

  // Blob storage bata pani file haru permanently delete garne
  for (const doc of [...staticDocs, ...taxClearances, ...experienceLetters]) {
    await deleteFile(doc.fileUrl);
  }

  // Database bata records purai hataune
  await Promise.all([
    prisma.companyDocument.deleteMany({ where: cutoff }),
    prisma.taxClearance.deleteMany({ where: cutoff }),
    prisma.experienceLetter.deleteMany({ where: cutoff }),
  ]);

  const totalPurged = staticDocs.length + taxClearances.length + experienceLetters.length;

  return NextResponse.json({ success: true, purgedCount: totalPurged });
}
