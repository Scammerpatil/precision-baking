import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import SavedRecipe from "@/models/SavedRecipe";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || null;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodeId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const { recipe, name } = await req.json();
    const newSavedRecipe = new SavedRecipe({
      user: decodeId.id,
      recipe,
      name,
    });
    await newSavedRecipe.save();
    return NextResponse.json({ message: "Recipe saved successfully!" });
  } catch (error) {
    console.log("Something went wrong!!!", error);
    return NextResponse.json(
      { message: "Something went wrong!!!" },
      { status: 500 }
    );
  }
}
