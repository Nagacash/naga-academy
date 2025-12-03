import { writeClient } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Protect this route - only allow in development or with proper auth
export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }
  try {
    const filePath = path.join(process.cwd(), "sample-data.ndjson");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.trim().split("\n").filter((line) => line.trim());

    const results = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const doc = JSON.parse(line);
        
        // Check if document already exists
        const existing = await writeClient.fetch(`*[_id == $id][0]`, { id: doc._id });
        
        if (existing) {
          // Document exists - skip to preserve user's manual edits (images, URLs, etc.)
          results.push({
            index: i + 1,
            type: doc._type,
            id: doc._id,
            title: doc.title || doc._id,
            success: true,
            skipped: true,
            message: "Document already exists, skipped to preserve manual edits",
          });
        } else {
          // Document doesn't exist - create it
          const result = await writeClient.create(doc);
          results.push({
            index: i + 1,
            type: doc._type,
            id: doc._id,
            title: doc.title || doc._id,
            success: true,
          });
        }
      } catch (error) {
        results.push({
          index: i + 1,
          error: error instanceof Error ? error.message : String(error),
          success: false,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Imported ${successCount} documents${failCount > 0 ? `, ${failCount} failed` : ""}`,
      total: lines.length,
      imported: successCount,
      failed: failCount,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

