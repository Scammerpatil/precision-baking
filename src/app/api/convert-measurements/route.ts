import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { recipe } = await req.json();
  if (!recipe) {
    return NextResponse.json(
      { message: "Please provide a recipe to convert" },
      { status: 400 }
    );
  }
  try {
    const recipeFilePath = "python/recipe.txt";
    fs.writeFileSync(recipeFilePath, recipe, "utf8");
    const { stdout, stderr } = await execAsync(`py -3.12 python/convert.py`);
    if (stderr) {
      console.log(stderr);
    }
    const parsedRecipe = JSON.parse(stdout.trim());

    return NextResponse.json({ recipe: parsedRecipe }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong!!!" },
      { status: 500 }
    );
  }
}
