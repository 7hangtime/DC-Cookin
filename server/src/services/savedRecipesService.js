import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "../config/supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recipesPath = path.join(__dirname, "../data/recipes.json");

async function loadAllRecipes() {
    const file = await fs.readFile(recipesPath, "utf-8");
    return JSON.parse(file);
}

export async function findSavedRecipeIdsByUserId(userId) {
    const { data, error } = await supabase
        .from("saved_recipes")
        .select("recipe_id")
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    const savedRecipeIds = data.map((row) => row.recipe_id);

    if (savedRecipeIds.length === 0) {
        return [];
    }

    const allRecipes = await loadAllRecipes();

    return allRecipes.filter((recipe) => savedRecipeIds.includes(recipe.id));
}

export async function deleteSavedRecipeByUserId(userId, recipeId) {
    const { error } = await supabase
        .from("saved_recipes")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);

    if (error) {
        throw error;
    }
}