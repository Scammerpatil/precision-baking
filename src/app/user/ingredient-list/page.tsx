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
      <div className="overflow-x-auto bg-base-300">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Ingredient</th>
              <th>Density (g/ml)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.food}</td>
                  <td>{item.density}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  No ingredients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default IngredientList;
