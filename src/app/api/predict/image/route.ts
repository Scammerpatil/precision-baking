import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 400 });
  }
  try {
    const fileBuffer = await file.arrayBuffer();
    const filePath = "python/upload/dish.jpg";
    fs.writeFileSync(filePath, Buffer.from(fileBuffer));
    var { stdout } = await execAsync(`py -3.12 python/image_predict.py`);
    const result = stdout
      .trim()
      .split("\n")
      .slice(2)
      .map((line) => line.replace(/\r$/, ""));
    return NextResponse.json(
      { result: JSON.parse(result.join("\n")) },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}
