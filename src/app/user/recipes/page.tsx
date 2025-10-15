"use client";
import Title from "@/components/Title";
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
      <Title title="Recipe Details" />
      <div className="px-10">
        {recipe && (
          <div className="bg-base-200 p-4 rounded-2xl px-10 w-full">
            <p className="mb-2 inline-block py-4 text-xl font-semibold text-center">
              {recipe.name}
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
      </div>
    </>
  );
};

export default RecipePage;
