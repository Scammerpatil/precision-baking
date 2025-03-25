import Request from "@/models/Request";
import Ride from "@/models/Ride";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const bookingId = searchParams.get("id");
  const booking = await Request.findById(bookingId);
  booking.payment = true;
  await booking.save();
  const user = await User.findOne({ _id: booking?.user });
  const ride = await Ride.findOne({ _id: booking?.ride });
  const amount = ride?.pricePerSeat * 100;
  const currency = "INR";
  var options = {
    amount: amount,
    currency: currency,
    receipt: "rcp1",
  };
  const order = await razorpay.orders.create(options);
  console.log(order);
  return NextResponse.json(
    { orderId: order.id, amount: order.amount, user },
    { status: 200 }
  );
}
