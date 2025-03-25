import Request from "@/models/Request";
import Ride from "@/models/Ride";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Id is required" }, { status: 400 });
  }
  try {
    const request = await Request.findByIdAndUpdate(id, { approved: true });
    const ride = await Ride.findOne({ _id: request.ride });
    ride.seats = ride.seats - 1;
    ride.passengers.push(request.user);
    await ride.save();
    return NextResponse.json(request);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to approve the request" },
      { status: 500 }
    );
  }
}
