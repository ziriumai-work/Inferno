import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetFolder = (formData.get("folder") as string) || "uploads";
    const customName = formData.get("customName") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension and filename
    const originalExt = path.extname(file.name) || "";
    const cleanExt = originalExt.toLowerCase();

    // Allowed extensions
    const allowedExts = [
      ".mp4",
      ".webm",
      ".mov",
      ".ogg",
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".gif",
      ".svg",
    ];

    if (cleanExt && !allowedExts.includes(cleanExt)) {
      return NextResponse.json(
        {
          success: false,
          error: `File type ${cleanExt} is not permitted. Please upload an image or video.`,
        },
        { status: 400 }
      );
    }

    const safeBaseName = path
      .basename(file.name, originalExt)
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    let filename: string;
    if (customName) {
      filename = customName.replace(/[^a-zA-Z0-9_.-]/g, "_");
      if (!filename.includes(".")) {
        filename += cleanExt;
      }
    } else {
      filename = `${safeBaseName}_${Date.now()}${cleanExt}`;
    }

    const targetDir =
      targetFolder === "root"
        ? path.join(process.cwd(), "public")
        : path.join(process.cwd(), "public", "uploads");

    await mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = targetFolder === "root" ? `/${filename}` : `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "File upload failed" },
      { status: 500 }
    );
  }
}

