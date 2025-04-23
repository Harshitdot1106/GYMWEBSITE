import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Meal {
  name: string;
  calories: number;
}

interface MealsData {
  [key: string]: Meal[];
}

const DietGenerator: React.FC = () => {
  const [dietType, setDietType] = useState<"Anything" | "Vegetarian">("Anything");
  const [calories, setCalories] = useState<number>(1800);
  const [meals, setMeals] = useState<number>(3);
  const [plan, setPlan] = useState<Meal[]>([]);
  const [error, setError] = useState<string>("");
  const [mealsData, setMealsData] = useState<MealsData>({ Anything: [], Vegetarian: [] });

  useEffect(() => {
    console.log("Fetching meal data from backend...");
    axios.get("http://localhost:300/api/meal")
      .then((res) => {
        const rawData = res.data;
        console.log("Raw meal data:", rawData);

        if (!Array.isArray(rawData)) {
          throw new Error("Invalid data format received from backend");
        }

        console.log("Valid meal data format received from backend");
        console.log("First item:", rawData[0]);

        const grouped: MealsData = {
          Anything: [],
          Vegetarian: [],
        };

        rawData.forEach((item: any) => {
          const meal: Meal = {
            name: item.INAME || item.iname, // Handle both uppercase and lowercase cases for name
            calories: item.CALORIE || item.calorie, // Handle both uppercase and lowercase cases for calories
          };

          if (item.TYPE === "Vegetarian" || item.type === "Vegetarian") { // Handle both uppercase and lowercase cases for type
            grouped.Vegetarian.push(meal);
          } else {
            grouped.Anything.push(meal);
          }
        });

        setMealsData(grouped);
      })
      .catch((err) => {
        console.error("Error fetching meal data:", err);
        setError("Failed to load meal data from backend");
      });
  }, []);

  const handleGenerate = () => {
    if (calories < 500 || calories > 5000) {
      setError("Please enter calories between 500 and 5000");
      return;
    }

    setError("");
    const targetPerMeal = Math.floor(calories / meals);
    const options = mealsData[dietType];

    try {
      const selected: Meal[] = [];

      for (let i = 0; i < meals; i++) {
        const filtered = options.filter(
          (meal) =>
            meal.calories <= targetPerMeal + 100 &&
            meal.calories >= targetPerMeal - 150
        );

        if (filtered.length === 0) {
          throw new Error("No suitable meals found for your calorie requirements");
        }

        const random = filtered[Math.floor(Math.random() * filtered.length)];
        if (!selected.some((meal) => meal.name === random.name)) {
          selected.push(random);
        } else {
          i--;
        }
      }

      setPlan(selected);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate meal plan");
      setPlan([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar />

      <div className="flex-grow min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-6">
          <h2 className="text-xl font-bold text-center mb-4">Preferred Diet</h2>

          <div className="flex justify-center gap-4 mb-4">
            {["Anything", "Vegetarian"].map((type) => (
              <button
                key={type}
                onClick={() => setDietType(type as "Anything" | "Vegetarian")}
                className={`px-4 py-2 rounded border ${
                  dietType === type ? "bg-orange-200 border-orange-400" : "border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="text-center mb-4">
            <label>I want to eat </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="border px-2 py-1 w-20 mx-2 rounded"
            />
            calories in
            <select
              value={meals}
              onChange={(e) => setMeals(Number(e.target.value))}
              className="border ml-2 px-2 py-1 rounded"
            >
              {[1, 2, 3, 4, 5].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>{" "}
            meals
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
            >
              Generate
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 p-4 rounded-lg text-center text-red-600 mb-6">
            {error}
          </div>
        )}

        {plan.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">Your Meal Plan</h3>
            <ul className="space-y-2">
              {plan.map((meal, idx) => (
                <li key={idx} className="border p-3 rounded">
                  🍽️ {meal.name} — {meal.calories} cal
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietGenerator;
