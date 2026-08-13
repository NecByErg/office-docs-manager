// ==============================================
// Authentication Helper
// ==============================================
// KASARI KAAM GARXA:
// 1. Team member le shared PIN halxa login page ma
// 2. Server le check garxa PIN milyo ki nai (.env ma vako TEAM_ACCESS_PIN sanga)
// 3. Milyo bhane, euta "signed token" (cookie) banaera browser ma pathaunxa
//    - Yo token le vanxa "yo user login vayeko ho" - tara PIN aafai kahi store hudaina
//    - Token "signed" hune le garda kasैले pani fake token banaera cheat garna sakdaina
// 4. Admin delete garnu paryo bhane, arko separate ADMIN_DELETE_PIN chahinxa
//    (yo alag ho, extra layer of protection ko lagi)

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "erdocs_session";
const SESSION_DURATION_HOURS = 24 * 7; // 7 days - team le pattak pattak login nagarnu paros

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is missing. Set it in .env file.");
  }
  return new TextEncoder().encode(secret);
}

// Login huda yo function le session token banaunxa
export async function createSession() {
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // JavaScript le cookie padhna nasakos (XSS attack bata protect)
    secure: process.env.NODE_ENV === "production", // production ma HTTPS matra
    sameSite: "strict", // arko site bata cookie use huna nadinu
    maxAge: SESSION_DURATION_HOURS * 60 * 60,
    path: "/",
  });
}

// Kunai request ma valid session xa ki nai check garxa (middleware ra pages ma use huncha)
export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return false;

    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false; // token invalid, expired, ya tampered vayeko
  }
}

// Logout garda cookie hataunxa
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Shared team PIN check garxa
export function verifyTeamPin(inputPin: string): boolean {
  const correctPin = process.env.TEAM_ACCESS_PIN;
  if (!correctPin) return false;
  return inputPin === correctPin;
}

// Admin delete PIN check garxa (delete garne bela extra confirmation ko lagi)
export function verifyAdminPin(inputPin: string): boolean {
  const correctPin = process.env.ADMIN_DELETE_PIN;
  if (!correctPin) return false;
  return inputPin === correctPin;
}
