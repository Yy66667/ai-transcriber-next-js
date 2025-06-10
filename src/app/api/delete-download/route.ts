import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const filePath = body?.path;

    // Validate input
    if (!filePath || typeof filePath !== "string" || !filePath.startsWith("api/download")) {
      return NextResponse.json(
        { success: false, error: "Invalid or unauthorized file path" },
        { status: 400 }
      );
    
    }

    const filename = filePath.split('/').pop();
    const fullPath = path.join(process.cwd(), "tmp","downloads", filename!);

    await unlink(fullPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete file:", error);
    return NextResponse.json({ success: false, error: "Deletion failed" }, { status: 500 });
  }
}
