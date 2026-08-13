// ==============================================
// Login API
// ==============================================
// Login page bata PIN pathaudा yo route le check garxa PIN sahi xa ki nai.
// Sahi vaye session cookie banaidinxa (createSession function le).

import { NextRequest, NextResponse } from "next/server";
import { verifyTeamPin, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ error: "PIN required" }, { status: 400 });
    }

    if (!verifyTeamPin(pin)) {
      // Galat PIN vaye specific error nadine (security: "PIN sahi xaina" matra vanne,
      // "username xaina" ya "password galat" jasto detail nadine)
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    await createSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
