// app/api/download/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest, props: { params: Promise<{ [key: string]: string  }> }) {
  const params = await props.params;
  try {
    await params.filename as string;
    
    const filePath = path.join(process.cwd(), "tmp", "downloads", params.filename);

    // Read file into memory
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${params.filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
