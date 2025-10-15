"use client";
import Title from "@/components/Title";
import { IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

type Ingredient = {
  food: string;
  density: number;
};

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");

  const fetchIngredients = async () => {
    try {
      const res = await axios.get("/api/ingredients");
      setIngredients(res.data);
    } catch (error) {
      console.error("Error fetching ingredients", error);
    }
  };

  useEffect(() => {
    // Ctrl + K to focus search input
    fetchIngredients();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filtered = ingredients.filter((item) =>
    item.food.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Title title="Ingredient List" />
      <div className="px-10">
        <label className="input input-primary input-bordered w-full mb-4 flex items-center">
          <IconSearch className="mr-2" />
          <input
            type="search"
            className="grow"
            placeholder="Search ingredient..."
            id="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="kbd kbd-sm">ctrl</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
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
      </div>
    </>
  );
};

export default IngredientList;
