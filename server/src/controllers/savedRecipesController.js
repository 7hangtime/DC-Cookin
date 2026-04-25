import {
    findSavedRecipeIdsByUserId,
    deleteSavedRecipeByUserId,
    saveRecipeByUserId
} from "../services/savedRecipesService.js";

function getUserIdFromRequest(req) {
    const userId = req.headers["x-user-id"];

    if (!userId || userId === "null" || userId === "undefined") {
        return null;
    }

    return userId;
}

export async function getSavedRecipes(req, res) {
    try {
        const userId = getUserIdFromRequest(req);

        if (!userId) {
            return res.status(401).json({ error: "User ID is required" });
        }

        const recipes = await findSavedRecipeIdsByUserId(userId);

        return res.status(200).json(recipes);
    } catch (error) {
        console.error("Error loading saved recipes:", error);
        return res.status(500).json({ error: "Failed to load saved recipes" });
    }
}

export async function deleteSavedRecipe(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const { recipeId } = req.params;

        if (!userId) {
            return res.status(401).json({ error: "User ID is required" });
        }

        await deleteSavedRecipeByUserId(userId, recipeId);

        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting saved recipe:", error);
        return res.status(500).json({ error: "Failed to delete saved recipe" });
    }
}

export async function saveRecipe(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const { recipeId } = req.params;

        if (!userId) {
            return res.status(401).json({ error: "User ID is required" });
        }

        await saveRecipeByUserId(userId, recipeId);

        return res.status(201).json({ message: "Recipe saved successfully" });
    } catch (error) {
        console.error("Error saving recipe:", error);
        return res.status(500).json({ error: "Failed to save recipe" });
    }
}