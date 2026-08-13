// ==============================================
// Google Drive Backup Helper
// ==============================================
// KINA YO CHAHINXA:
// Yedi Vercel Blob down vayo ya kunai problem vayo bhane pani, documents ko
// copy Google Drive ma safe rahos vanera yo automatic backup system banayeko ho.
//
// Yo function le harek upload पछि background ma file ko copy Google Drive
// ma pani pathaidinxa. Yedi Google Drive backup fail vayo pani, main upload
// (Vercel Blob) chai fail hudaina - backup matra best-effort ho.

import { google } from "googleapis";
import { Readable } from "stream";

function getDriveClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    return null; // Google Drive backup configure nagariएको vaye silently skip garne
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  return google.drive({ version: "v3", auth });
}

export async function backupToGoogleDrive(
  filename: string,
  buffer: Buffer
): Promise<string | null> {
  try {
    const drive = getDriveClient();
    if (!drive) {
      console.warn("Google Drive backup not configured - skipping backup");
      return null;
    }

    const folderId = process.env.GOOGLE_DRIVE_BACKUP_FOLDER_ID;

    const response = await drive.files.create({
      requestBody: {
        name: filename,
        parents: folderId ? [folderId] : undefined,
      },
      media: {
        mimeType: "application/pdf",
        body: Readable.from(buffer),
      },
      fields: "id, webViewLink",
    });

    return response.data.webViewLink || null;
  } catch (error) {
    // Backup fail vaye pani main system chalirahos - error matra log garne
    console.error("Google Drive backup failed (non-critical):", error);
    return null;
  }
}

export async function deleteFromGoogleDrive(fileId: string): Promise<void> {
  try {
    const drive = getDriveClient();
    if (!drive) return;
    await drive.files.delete({ fileId });
  } catch (error) {
    console.error("Google Drive delete error (non-critical):", error);
  }
}
