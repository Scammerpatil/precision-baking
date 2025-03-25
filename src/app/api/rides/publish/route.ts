import Ride from "@/models/Ride";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  const { ride } = await req.json();
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  if (!ride) {
    return NextResponse.json(
      { message: "Ride details are required" },
      { status: 400 }
    );
  }
  try {
    const newRide = new Ride({
      ...ride,
      organiser: data.id,
    });
    await newRide.save();
    return NextResponse.json({ message: "Ride published" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to publish ride" },
      { status: 500 }
    );
  }
}
