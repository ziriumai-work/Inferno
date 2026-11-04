import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

function validateMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;

  switch (ext) {
    case ".pdf":
      // %PDF-
      return (
        buffer[0] === 0x25 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x44 &&
        buffer[3] === 0x46
      );
    case ".png":
      // 0x89 P N G
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
      );
    case ".jpg":
    case ".jpeg":
      // 0xFF 0xD8 0xFF
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case ".docx":
      // Zip container (PK..)
      return (
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
        (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08)
      );
    case ".mp4":
    case ".mov":
      // Check for 'ftyp' or 'moov' at byte offset 4
      if (buffer.length >= 8) {
        const subtype = buffer.toString("ascii", 4, 8);
        return subtype === "ftyp" || subtype === "moov";
      }
      return true;
    case ".webp":
      // RIFF....WEBP
      if (buffer.length >= 12) {
        return (
          buffer.toString("ascii", 0, 4) === "RIFF" &&
          buffer.toString("ascii", 8, 12) === "WEBP"
        );
      }
      return true;
    default:
      return true;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetFolder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Enforce 10MB size limit
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File exceeds the maximum allowable upload size of 10MB.",
        },
        { status: 413 }
      );
    }

    // Sanitize extension
    const originalExt = path.extname(file.name) || "";
    const cleanExt = originalExt.toLowerCase();

    const allowedExts = [
      ".pdf",
      ".docx",
      ".mp4",
      ".webm",
      ".mov",
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
    ];

    if (!cleanExt || !allowedExts.includes(cleanExt)) {
      return NextResponse.json(
        {
          success: false,
          error: `File format '${cleanExt}' is not permitted. Only PDF, DOCX, images, and MP4 are accepted.`,
        },
        { status: 400 }
      );
    }

    // Validate binary magic bytes signature
    if (!validateMagicBytes(buffer, cleanExt)) {
      return NextResponse.json(
        {
          success: false,
          error: "File content does not match the declared extension signature.",
        },
        { status: 400 }
      );
    }

    // Generate secure randomized filename to prevent traversal and overwrites
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const filename = `tig_${Date.now()}_${randomSuffix}${cleanExt}`;

    const targetDir =
      targetFolder === "root"
        ? path.join(process.cwd(), "public")
        : path.join(process.cwd(), "public", "uploads");

    await mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl =
      targetFolder === "root" ? `/${filename}` : `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: buffer.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "File upload failed";
    console.error("File upload error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
