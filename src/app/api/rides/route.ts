import dbConfig from "@/middlewares/db.config";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Ride from "@/models/Ride";

dbConfig();
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect("/login");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const rides = await Ride.find({ organiser: data.id })
      .populate("organiser")
      .populate("passengers");
    return NextResponse.json(
      { message: "Rides found succesfully", rides },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong!!!" },
      { status: 500 }
    );
  }
}
