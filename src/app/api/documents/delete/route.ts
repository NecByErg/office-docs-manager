// ==============================================
// Delete API (Soft Delete -> Trash)
// ==============================================
// KASARI KAAM GARXA:
// - Normal team member le "delete" button click garxa
// - System le Admin PIN sodhxa (extra confirmation layer)
// - Sahi PIN halepachi, file PURAI delete NAHUNE - "trash" ma jaane
//   (isDeleted = true, deletedAt = aaile ko time)
// - 30 din pachi automatic purge huन्छ (separate cleanup job le handle garxa)
// - Yesले garda galti le delete vaye pani 30 din samma recover garna milxa

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminPin } from "@/lib/auth";

type DocType = "static" | "tax_clearance" | "experience_letter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { docType, docId, adminPin } = body as {
      docType: DocType;
      docId: string;
      adminPin: string;
    };

    if (!docType || !docId || !adminPin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!verifyAdminPin(adminPin)) {
      return NextResponse.json({ error: "Incorrect Admin PIN" }, { status: 403 });
    }

    const now = new Date();

    if (docType === "static") {
      await prisma.companyDocument.update({
        where: { id: docId },
        data: { isDeleted: true, deletedAt: now },
      });
    } else if (docType === "tax_clearance") {
      await prisma.taxClearance.update({
        where: { id: docId },
        data: { isDeleted: true, deletedAt: now },
      });
    } else if (docType === "experience_letter") {
      await prisma.experienceLetter.update({
        where: { id: docId },
        data: { isDeleted: true, deletedAt: now },
      });
    } else {
      return NextResponse.json({ error: "Invalid docType" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Moved to trash. Recoverable for 30 days." });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
