"use client";
import Title from "@/components/Title";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export interface RecipeData {
  quantity: number;
  unit: string;
  ingredient: string;
  grams: number;
}

const ConvertMeasurement = () => {
  const [recipe, setRecipe] = useState<string>("");
  const [response, setResponse] = useState<RecipeData[]>();

  const handleUpload = async () => {
    try {
      const res = axios.post("/api/convert-measurements", { recipe });

      toast.promise(res, {
        loading: "Converting the recipe...",
        success: (data) => {
          setResponse(data.data.recipe);
          return "Recipe converted successfully!";
        },
        error: "Something went wrong!!!",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong!!!");
    }
  };

  const handleSaveRecipe = async () => {
    const recipeName = prompt("Enter a name for your recipe:");
    if (!recipeName) return;

    try {
      const res = axios.post("/api/saved-recipes", {
        recipe: JSON.stringify(response),
        name: recipeName,
      });
      toast.promise(res, {
        loading: "Saving recipe...",
        success: "Recipe saved successfully!",
        error: "Something went wrong!!!",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong!!!");
    }
  };

  return (
    <>
      <Title title="Convert Measurements" />
      <div className="px-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base font-bold">
              Upload The Ingredients<span className="text-error">*</span>
            </legend>
            <textarea
              className="textarea textarea-primary w-full"
              placeholder="Upload the Ingredients here..."
              rows={4}
              value={recipe}
              onChange={(e) => setRecipe(e.target.value)}
            />
          </fieldset>
          <button className="btn btn-primary w-full" onClick={handleUpload}>
            Convert Measurements
          </button>

          {response && (
            <div className="bg-base-300 p-4 rounded-lg shadow-md mt-4 space-y-4">
              <h2 className="text-xl font-semibold mb-2">Converted Recipe:</h2>
              {
                <ul className="space-y-2">
                  {response.length === 0 && (
                    <li className="p-4 bg-base-100 border border-base-200 rounded-lg shadow-sm">
                      No ingredients found in the recipe.
                    </li>
                  )}
                  {response.map((item, index) => (
                    <li
                      key={index}
                      className="p-4 bg-base-100 border border-base-200 rounded-lg shadow-sm capitalize"
                    >
                      <span className="font-semibold">{item.quantity}</span>{" "}
                      {item.unit} - {item.ingredient} - ({item.grams} grams)
                    </li>
                  ))}
                </ul>
              }
              <div className="mt-4">
                <button
                  className="btn btn-accent w-full"
                  onClick={handleSaveRecipe}
                >
                  Save Recipe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConvertMeasurement;
