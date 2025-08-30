"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const RecipePage = () => {
  const [recipe, setRecipe] = useState<any>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!id) {
    return <div>Error: Missing recipe ID</div>;
  }
  const fetchRecipe = async () => {
    const response = await fetch(`/api/recipes/getRecipe?id=${id}`);
    if (!response.ok) {
      console.error("Failed to fetch recipe");
      return;
    }
    const data = await response.json();
    setRecipe(data);
    console.log(data);
  };
  useEffect(() => {
    fetchRecipe();
  }, []);
  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">
        Saved Recipe Details
      </h1>
      {recipe && (
        <div className="bg-base-200 p-4 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Recipe Details</h2>
          <p className="mb-2">
            <span className="font-semibold">Name:</span> {recipe.name}
          </p>
          <h3 className="text-xl font-bold mb-2">Ingredients</h3>
          <ul className="list-disc list-inside">
            {JSON.parse(recipe.recipe).map((item: any, index: number) => (
              <li key={index}>
                {item.quantity} {item.unit} {item.ingredient} - {item.grams}{" "}
                grams
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default RecipePage;
