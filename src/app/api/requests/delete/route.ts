import Request from "@/models/Request";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  const request = await Request.findByIdAndDelete(id);
  return NextResponse.json(request);
}
