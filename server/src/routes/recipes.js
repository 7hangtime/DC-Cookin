import express from "express";
import fs from "fs";
import { matchRecipes } from "../utils/matchRecipes.js";

export default function recipesRouter(recipesData) {
  const router = express.Router();

 router.get("/", (req, res) => {
   const { diet } = req.query;

   let result = recipesData;

   if (diet === "vegan") {
     result = recipesData.filter((r) => r.is_vegan === true);
   }

   if (diet === "non-vegan") {
     result = recipesData.filter((r) => r.is_vegan === false);
   }

   return res.json(result);
 });

  router.post("/add", (req, res) => {
    if (!req.body.recipename || !req.body.ingredients) {
      return res
        .status(400)
        .json({ error: "Recipe name and ingredients are required" });
    }

    const newRecipe = {
      id: req.body.recipename.trim().toLowerCase().replace(/\s+/g, "-"),
      name: req.body.recipename,
      ingredients: req.body.ingredients.split(","),
      ingredients_with_measurements: (req.body.measurements || "").split(","),
      directions: (req.body.instructions || "").split(","),
      image_url: req.body.image || "",
    };

    const file = "./src/data/recipes.json";

    let recipes = [];
    try {
      if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, "utf8");
        recipes = JSON.parse(data);
      }
    } catch (err) {
      return res.status(500).json({ error: "Could not read recipes" });
    }

    recipes.push(newRecipe);

    try {
      fs.writeFileSync(file, JSON.stringify(recipes, null, 2), "utf8");
    } catch (err) {
      return res.status(500).json({ erro: "Could not save recipe" });
    }

    return res.status(200).json(newRecipe);
  });

  router.post("/matches", (req, res) => {
    const pantry = req.body?.ingredients;
    const preferences = req.body?.preferences || {};
    if (!Array.isArray(pantry)) {
      return res
        .status(400)
        .json({ error: "Body must include ingredients: string[]" });
    }

    const maxMissing = Number(req.body?.maxMissing ?? 2);
    const result = matchRecipes(recipesData, pantry, {
      maxMissing,
      preferences,
    });
    return res.json(result);
  });

  router.get("/:id", (req, res) => {
    const { id } = req.params;

    const recipe = recipesData.find((r) => r.id === id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    return res.json(recipe);
  });



  return router;
}