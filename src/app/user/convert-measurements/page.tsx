"use client";
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

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Convert To Bake Precisely
      </h1>
      <div className="max-w-lg mx-auto space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            Upload The Recipe<span className="text-area-error">*</span>
          </legend>
          <textarea
            className="textarea textarea-primary w-full h-56"
            placeholder="Upload the Recipe"
            value={recipe}
            onChange={(e) => setRecipe(e.target.value)}
          />
        </fieldset>
        <button className="btn btn-primary w-full" onClick={handleUpload}>
          Upload The Recipe
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
                    className="p-4 bg-base-100 border border-base-200 rounded-lg shadow-sm"
                  >
                    <span className="font-semibold">{item.quantity}</span>{" "}
                    {item.unit} - {item.ingredient} - ({item.grams} grams)
                  </li>
                ))}
              </ul>
            }
          </div>
        )}
      </div>
    </>
  );
};

export default ConvertMeasurement;
