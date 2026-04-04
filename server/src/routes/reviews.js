// reviews.js
import express from "express";
import { supabase } from "../../supabase.js";
import fs from "fs";
import path from "path";

const router = express.Router();
const recipesPath = path.resolve("./src/data/recipes.json");
const recipes = JSON.parse(fs.readFileSync(recipesPath, "utf-8"));

// POST /api/reviews
// Add a new review (one per user per recip
router.post("/", async (req, res) => {
  try {
    const { user_id, recipe_id, rating, comment } = req.body;

    if (!user_id || !recipe_id || rating == null || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate recipe_id against JSON
    const recipeExists = recipes.some((r) => r.id === recipe_id);
    if (!recipeExists) {
      return res.status(400).json({ error: "Invalid recipe_id" });
    }

    // Check if user already reviewed this recipe
    const { data: existing, error: checkError } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user_id)
      .eq("recipe_id", recipe_id);

    if (checkError) throw checkError;

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "You have already reviewed this recipe" });
    }

    // Insert new review
    const { data, error: insertError } = await supabase
      .from("reviews")
      .insert([{ user_id, recipe_id, rating, comment }])
      .select() // to return the inserted row
      .single();

    if (insertError) throw insertError;

    return res.status(201).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// GET /api/reviews/:recipeId
router.get("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Find recipe from JSON
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Get reviews from Supabase
const { data, error } = await supabase
  .from("reviews")
  .select("*")
  .eq("recipe_id", recipeId)
  .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ reviews: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// GET /api/reviews/:recipeId/average
// Get average rating and review count
router.get("/:recipeId/average", async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Validate recipe exists
    const recipeExists = recipes.some((r) => r.id === recipeId);
    if (!recipeExists) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("rating", { count: "exact" })
      .eq("recipe_id", recipeId);

    if (error) throw error;

    const count = data.length;
    const average =
      count === 0 ? 0 : data.reduce((sum, r) => sum + r.rating, 0) / count;

    res.json({
      recipe_id: recipeId,
      average_rating: parseFloat(average.toFixed(2)),
      review_count: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
