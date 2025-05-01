import fs from "fs";
import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function GET() {
  try {
    const filePath = "python/density_data.csv";
    const file = fs.readFileSync(filePath, "utf-8");
    const parsed = Papa.parse(file, { header: true });
    return NextResponse.json(parsed.data, { status: 200 });
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return NextResponse.json(
      { error: "Failed to read CSV file" },
      { status: 500 }
    );
  }
}
