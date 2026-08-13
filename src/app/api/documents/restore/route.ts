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

    if (!verifyAdminPin(adminPin)) {
      return NextResponse.json({ error: "Incorrect Admin PIN" }, { status: 403 });
    }

    if (docType === "static") {
      await prisma.companyDocument.update({ where: { id: docId }, data: { isDeleted: false, deletedAt: null } });
    } else if (docType === "tax_clearance") {
      await prisma.taxClearance.update({ where: { id: docId }, data: { isDeleted: false, deletedAt: null } });
    } else if (docType === "experience_letter") {
      await prisma.experienceLetter.update({ where: { id: docId }, data: { isDeleted: false, deletedAt: null } });
    } else {
      return NextResponse.json({ error: "Invalid docType" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Restore error:", error);
    return NextResponse.json({ error: "Restore failed" }, { status: 500 });
  }
}
