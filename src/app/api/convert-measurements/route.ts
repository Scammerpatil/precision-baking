import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { recipe } = await req.json();
  try {
    const { stdout, stderr } = await execAsync(
      `py -3.12 python/convert.py ${recipe}`
    );
    if (stderr) {
      console.log(stderr);
    }
    return NextResponse.json({ recipe: stdout.trim() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong!!!" },
      { status: 500 }
    );
  }
}
