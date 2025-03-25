import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
dbConfig();
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  if (!id || !status) {
    return NextResponse.json(
      { message: "Id and Status are required!!" },
      { status: 400 }
    );
  }
  try {
    await User.findByIdAndUpdate(id, { isVerified: status });
    return NextResponse.json(
      { message: "User status updated successfully!!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Ooops!! Something went wrong!!!" },
      { status: 500 }
    );
  }
}
