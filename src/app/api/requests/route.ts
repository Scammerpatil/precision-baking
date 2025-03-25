import Ride from "@/models/Ride";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Request from "@/models/Request";

export async function POST(req: NextRequest) {
  const { rideId } = await req.json();
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect("/login");
  }
  const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  try {
    const existingRide = await Ride.findById(rideId);
    const newRequest = new Request({
      ride: existingRide._id,
      user: data.id,
      owner: existingRide.organiser,
      status: "pending",
    });
    await newRequest.save();
    return NextResponse.json({ message: "Ride booked" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to book ride" },
      { status: 500 }
    );
  }
}
