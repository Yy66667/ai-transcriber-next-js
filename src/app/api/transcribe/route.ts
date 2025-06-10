import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const config = {
  api: {
    bodyParser: false, // still needed to disable default parser
  },
};



export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract fields
    const audioFile = formData.get("audio");
    const prompt = formData.get("prompt");
    const SelectModel = formData.get("SelectModel");
    const GEMINI_API_KEY = formData.get("GeminiAPI");
    //@ts-ignore
    const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY!});


    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json({ error: "No audio file uploaded" }, { status: 400 });
    }
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }
    if (!SelectModel) {
      return NextResponse.json({ error: "SelectModel is required." }, { status: 400 });
    }
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key not provided" }, { status: 400 });
    }

    if (typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt must be a string' }, { status: 400 });
    }

    if (typeof SelectModel !== 'string') {
      return NextResponse.json({ error: 'SelectModel must be a string' }, { status: 400 });
    }

    if (typeof GEMINI_API_KEY !== 'string') {
      return NextResponse.json({ error: 'GeminiAPI must be a string' }, { status: 400 });
    }
    if (!(audioFile instanceof File)) {
      return NextResponse.json({ error: 'Audio file must be a file' }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to temp location before uploading to GoogleGenAI
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const tempFileName = uuidv4() + "-" + audioFile.name;
    const tempFilePath = path.join(uploadDir, tempFileName);
    fs.writeFileSync(tempFilePath, buffer);

    // Upload file to GoogleGenAI
    const uploadfile = await genAI.files.upload({
      file: tempFilePath,
      config: {
        mimeType: audioFile.type,
      },
    });

    console.log("reached here //1")

    // Generate transcription
    const response = await genAI.models.generateContent({
      model: SelectModel,
      config: {
        temperature: 0,
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { fileData: { fileUri: uploadfile.uri } },
          ],
        },
      ],
    });

    const transcriptText: string | undefined = response.text;
    if (!transcriptText) {
      return NextResponse.json({ error: "No transcription received" }, { status: 500 });
    }

    // Build docx document
    const paragraphs = transcriptText.split("\n").filter((line) => line.trim() !== "");

    const doc = new Document({
      sections: [
        {
          children: paragraphs.map((line) => {
            const speakerMatch = line.match(/^\*\*(.+?):\*\*\s?(.*)/);
            if (speakerMatch) {
              const [, speaker, dialogue] = speakerMatch;
              const parts = dialogue.split(/(\*[^*]+\*)/g).map((part) => {
                if (part.startsWith("*") && part.endsWith("*")) {
                  return new TextRun({ text: part.slice(1, -1), italics: true });
                }
                return new TextRun({ text: part });
              });
              return new Paragraph({
                children: [new TextRun({ text: `${speaker}:`, bold: true }), ...parts],
                spacing: { after: 200 },
              });
            } else {
              const parts = line.split(/(\*[^*]+\*)/g).map((part) => {
                if (part.startsWith("*") && part.endsWith("*")) {
                  return new TextRun({ text: part.slice(1, -1), italics: true });
                }
                return new TextRun({ text: part });
              });
              return new Paragraph({
                children: parts,
                spacing: { after: 200 },
              });
            }
          }),
        },
      ],
    });

    console.log("reached here //2")

    const docBuffer = await Packer.toBuffer(doc);

    // Save docx file to public/downloads
    const fileId = uuidv4();
    const outputDir = path.join(process.cwd(), "public", "downloads");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const docxPath = path.join(outputDir, `${fileId}.docx`);
    fs.writeFileSync(docxPath, docBuffer);

    // Delete temp audio file
    fs.unlinkSync(tempFilePath);

    return NextResponse.json({
      result: transcriptText,
      downloadUrl: `/downloads/${fileId}.docx`,
    });
  } catch (error) {
    console.error("Error in transcription API:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
