import express from "express";
import { matchRecipes } from "../utils/matchRecipes.js";

const router = express.Router();

export default function recipesRouter(recipesData) {
    router.post("/matches", (req, res) => {
        const pantry = req.body?.ingredients;

        if (!Array.isArray(pantry)) {
            return res.status(400).json({ error: "Body must include ingredients: string[]" });
        }

        const maxMissing = Number(req.body?.maxMissing ?? 2);

        const result = matchRecipes(recipesData, pantry, { maxMissing });
        return res.json(result);
    });

    return router;
}

router.get("/:id", (req, res) => {
    const { id } = req.params;

    const recipe = recipesData.find(r => r.id === id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    return res.json(recipe);
});