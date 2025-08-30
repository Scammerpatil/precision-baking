import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) {
    return NextResponse.json(
      { message: "Please provide a text" },
      { status: 400 }
    );
  }
  try {
    const { stdout } = await execAsync(
      `py -3.12 python/text_predict.py "${text}"`
    );
    return NextResponse.json(
      { result: JSON.parse(stdout.trim()) },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error predicting dish name" },
      { status: 500 }
    );
  }
}
