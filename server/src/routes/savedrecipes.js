import express from "express";
import {
    getSavedRecipes,
    deleteSavedRecipe,
} from "../controllers/savedRecipesController.js";

const router = express.Router();

router.get("/", getSavedRecipes);
router.delete("/:recipeId", deleteSavedRecipe);
router.post("/:recipeId", saveRecipe);

export default router;