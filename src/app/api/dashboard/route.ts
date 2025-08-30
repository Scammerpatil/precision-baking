import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Conversion from "@/models/Conversion";
import SavedRecipe from "@/models/SavedRecipe";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || null;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Count summary values
    const totalConversions =
      (await Conversion.countDocuments({ user: decodedId.id })) || 0;

    const ingredientsTracked = "500+"; // if static for now

    const recentConversions = await Conversion.find({ user: decodedId.id })
      .sort({ timestamp: -1 })
      .limit(5);

    const savedRecipesList = await SavedRecipe.find({
      user: decodedId.id,
    });

    const monthlyConversions = await Conversion.aggregate([
      { $match: { user: decodedId.id } },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          conversions: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlySaved = await SavedRecipe.aggregate([
      { $match: { user: decodedId.id } },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          saved: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const chartData: { month: string; conversions: number; saved: number }[] =
      [];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 1; i <= 12; i++) {
      const conv =
        monthlyConversions.find((m) => m._id === i)?.conversions || 0;
      const sav = monthlySaved.find((m) => m._id === i)?.saved || 0;
      chartData.push({
        month: monthNames[i - 1],
        conversions: conv,
        saved: sav,
      });
    }

    return NextResponse.json(
      {
        totalConversions,
        ingredientsTracked,
        recentConversions: recentConversions.length,
        savedRecipes: savedRecipesList.length,
        savedRecipesList,
        chartData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching dashboard data:", error);
    return NextResponse.json(
      { message: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
