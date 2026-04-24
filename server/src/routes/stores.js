import express from "express";
import { supabase } from "../../supabase.js";
import fs from "fs";
import path from "path";

const recipesPath = path.resolve("./src/data/recipes.json");
const recipes = JSON.parse(fs.readFileSync(recipesPath, "utf-8"));
const router = express.Router();

router.get("/:id/inventory", async (req, res) => {
  const { data, error } = await supabase
    .from("inventory")
    .select(
      `
      id,
      quantity,
      ingredient:ingredient_id (
        id,
        ingredient_name
      )
    `
    )
    .eq("store_id", req.params.id);

  if (error) return res.status(500).json(error);

  res.json(data);
});

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("stores").select("*");

  if (error) return res.status(500).json(error);

  res.json(data);
});

router.get("/match/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { city } = req.query;

    //get recipe (JSON)
    const recipe = recipes.find((r) => r.id === recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // normalize recipe ingredients
    const missingIngredients = recipe.ingredients.map((i) =>
      i.trim().toLowerCase()
    );

    //get stores in city
    const { data: stores, error: storeError } = await supabase
      .from("stores")
      .select("*")
      .eq("location", city); 

    if (storeError) return res.status(500).json(storeError);

    // for each store get inventory
    const results = await Promise.all(
      stores.map(async (store) => {
        const { data: inventory, error: invError } = await supabase
          .from("inventory")
          .select(`*, ingredient:ingredient_id(ingredient_name)`)
          .eq("store_id", store.id);

        if (invError) throw invError;

        const available = (inventory || []).map((i) =>
          i.ingredient?.ingredient_name?.trim().toLowerCase()
        );

        const matches = missingIngredients.filter((m) => available.includes(m));

        return {
          ...store,
          availableIngredients: matches,
          matchCount: matches.length,
        };
      })
    );

    const filtered = results.filter((r) => r.matchCount > 0);

    return res.json(filtered);
  } catch (err) {
    console.error("MATCH ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});


export default router;