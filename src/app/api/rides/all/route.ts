import Ride from "@/models/Ride";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect("/login");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const rides = await Ride.find({ organiser: { $ne: data.id } })
      .populate("organiser")
      .populate("passengers");
    return NextResponse.json(rides);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch rides" },
      { status: 500 }
    );
  }
}
