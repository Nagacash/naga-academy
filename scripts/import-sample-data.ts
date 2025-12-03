import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "mo941b3r";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  throw new Error("SANITY_API_WRITE_TOKEN is required");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-11-27",
  token,
  useCdn: false,
});

async function importData() {
  const filePath = path.join(process.cwd(), "sample-data.ndjson");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.trim().split("\n");

  console.log(`Importing ${lines.length} documents...`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    try {
      const doc = JSON.parse(line);
      console.log(`[${i + 1}/${lines.length}] Importing ${doc._type}: ${doc.title || doc._id}`);

      await client.createOrReplace(doc);
    } catch (error) {
      console.error(`Error importing line ${i + 1}:`, error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  console.log("✅ Import complete!");
}

importData().catch(console.error);

