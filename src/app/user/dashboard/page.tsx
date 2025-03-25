"use client";
import {
  IconScale,
  IconList,
  IconCalculator,
  IconClipboardCheck,
  IconUser,
} from "@tabler/icons-react";

export default function Dashboard() {
  const conversionData = [
    { month: "Jan", conversions: 120, saved: 80 },
    { month: "Feb", conversions: 140, saved: 90 },
    { month: "Mar", conversions: 160, saved: 100 },
    { month: "Apr", conversions: 180, saved: 110 },
    { month: "May", conversions: 200, saved: 120 },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Precision Baking Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconScale size={40} />
          </div>
          <div className="stat-title">Total Conversions</div>
          <div className="stat-value text-primary">1.2K</div>
          <div className="stat-desc">15% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconList size={40} />
          </div>
          <div className="stat-title">Ingredients Tracked</div>
          <div className="stat-value text-secondary">350</div>
          <div className="stat-desc">Growing database of ingredients</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <IconCalculator size={40} />
          </div>
          <div className="stat-title">Recent Conversions</div>
          <div className="stat-value text-accent">200</div>
          <div className="stat-desc">Updated regularly</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <IconClipboardCheck size={40} />
          </div>
          <div className="stat-title">Saved Recipes</div>
          <div className="stat-value text-success">86</div>
          <div className="stat-desc">Keep track of your conversions</div>
        </div>
      </div>
    </>
  );
}
