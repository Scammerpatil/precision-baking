import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import { NextResponse } from "next/server";
dbConfig();
export async function GET() {
  const user = await User.find();
  return NextResponse.json(user);
}
