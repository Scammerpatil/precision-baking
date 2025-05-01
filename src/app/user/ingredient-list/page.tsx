"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type Ingredient = {
  food: string;
  density: number;
};

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await axios.get("/api/ingredients");
        setIngredients(res.data);
      } catch (error) {
        console.error("Error fetching ingredients", error);
      }
    };

    fetchIngredients();
  }, []);

  const filtered = ingredients.filter((item) =>
    item.food.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">
        Ingredient Densities
      </h1>

      <input
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Search ingredient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-base-content/70 uppercase text-4xl">
          No results found.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, index) => (
            <li
              key={index}
              className="p-4 bg-base-200 rounded-lg shadow-sm border border-base-300"
            >
              <h2 className="text-lg font-semibold">{item.food}</h2>
              <p className="text-sm text-base-content/80">
                Density: {item.density} g/ml
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default IngredientList;
