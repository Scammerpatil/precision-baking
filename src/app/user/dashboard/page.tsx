"use client";
import Title from "@/components/Title";
import { useUser } from "@/context/AuthProvider";
import {
  IconScale,
  IconList,
  IconCalculator,
  IconClipboardCheck,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { user } = useUser();
  const [chartData, setChartData] = useState<
    { month: string; conversions: number; saved: number }[]
  >([]);

  const [dashboardData, setDashboardData] = useState({
    totalConversions: 0,
    ingredientsTracked: 0,
    recentConversions: 0,
    savedRecipes: 0,
  });

  const [savedRecipes, setSavedRecipes] = useState<
    {
      _id: number;
      name: string;
      recipe: string;
      date: string;
      createdAt: Date;
    }[]
  >([]);

  const fetchDashboardData = async () => {
    const response = await fetch("/api/dashboard");
    const data = await response.json();
    setDashboardData(data);
    if (data.savedRecipes) {
      setChartData(data.chartData || []);
      setSavedRecipes(data.savedRecipesList);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    const res = axios.delete(`/api/recipes/delete?id=${id}`);
    toast.promise(res, {
      loading: "Deleting...",
      success: "Recipe deleted successfully!",
      error: "Error deleting recipe.",
    });
    fetchDashboardData();
  };

  return (
    <>
      <Title title={`Welcome, ${user?.name}`} />
      <div className="px-10 min-h-[calc(100vh-5.6rem)]">
        {/* Stat Cards */}
        <div className="stats shadow w-full bg-base-300 mb-10">
          <div className="stat">
            <div className="stat-figure text-primary">
              <IconScale size={40} />
            </div>
            <div className="stat-title">Total Conversions</div>
            <div className="stat-value text-primary">
              {dashboardData.totalConversions}
            </div>
            <div className="stat-desc">15% more than last month</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IconList size={40} />
            </div>
            <div className="stat-title">Ingredients Tracked</div>
            <div className="stat-value text-secondary">
              {dashboardData.ingredientsTracked}
            </div>
            <div className="stat-desc">Growing database of ingredients</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <IconCalculator size={40} />
            </div>
            <div className="stat-title">Recent Conversions</div>
            <div className="stat-value text-accent">
              {dashboardData.recentConversions}
            </div>
            <div className="stat-desc">Updated regularly</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <IconClipboardCheck size={40} />
            </div>
            <div className="stat-title">Saved Recipes</div>
            <div className="stat-value text-success">
              {dashboardData.savedRecipes}
            </div>
            <div className="stat-desc">Keep track of your conversions</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-base-200 shadow rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4 uppercase text-center">
            Conversions vs Saved Recipes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#3b82f6"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="saved"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Saved Recipes Table */}
        <div className="bg-base-200 shadow rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center uppercase">
            Saved Recipes
          </h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra bg-base-300 w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Recipe Name</th>
                  <th>Conversions</th>
                  <th>Date Saved</th>
                  <th>Actions</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {savedRecipes.length > 0 ? (
                  savedRecipes.map((recipe, index: number) => (
                    <tr key={recipe._id}>
                      <td>{index + 1}</td>
                      <td>{recipe.name}</td>
                      <td>{JSON.parse(recipe.recipe).length}</td>
                      <td>{new Date(recipe.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDelete(recipe._id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <a
                          href={`/user/recipes?id=${recipe._id}`}
                          aria-label={`View recipe ${recipe.name}`}
                          className="btn btn-sm btn-info"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-base-content/60"
                    >
                      No saved recipes yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
