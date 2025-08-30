import SavedRecipe from "@/models/SavedRecipe";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });
  }
  try {
    await SavedRecipe.deleteOne({ _id: id });
    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error deleting recipe" },
      { status: 500 }
    );
  }
}
