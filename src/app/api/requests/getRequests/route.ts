import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Request from "@/models/Request";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect("/login");
  }
  const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  const request = await Request.find({ owner: data.id })
    .populate("ride")
    .populate("owner")
    .populate("user");
  return NextResponse.json(request);
}
