// ==============================================
// Vercel Blob Storage Helper
// ==============================================
// Yesले files (converted PDF) lai Vercel Blob ma upload/delete garxa.
// Vercel Blob = file rakhne cloud storage (Vercel sangai integrated, 1GB free).

import { put, del } from "@vercel/blob";

export async function uploadFile(
  filename: string,
  buffer: Buffer,
  contentType: string = "application/pdf"
): Promise<{ url: string }> {
  const blob = await put(filename, buffer, {
    access: "public", // URL thaha vayeko manxe le matra kholna sakne (guessable naming avoid garxaun)
    contentType,
    addRandomSuffix: true, // same naam ko file duita upload hunda conflict nahos
  });

  return { url: blob.url };
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    // File already deleted vaye pani error nadeखाउने - silently continue
    console.error("Blob delete error (non-critical):", error);
  }
}
