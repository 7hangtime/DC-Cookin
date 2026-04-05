import express from "express";
import fs from "fs";
import path from "path";
import { matchRecipes } from "../utils/matchRecipes.js";

export default function recipesRouter(recipesData) {
    const router = express.Router();

    router.get("/", (req, res) => {
        return res.json(recipesData);
    });

    router.post("/", (req, res) => {
        const body = req.body;
        if (!body.recipename || !body.ingredients) {
            return res.status(400).json({ error: "Recipe name and ingredients are required" });
        }

        const newRecipe = {
            id: body.recipename.trim().toLowerCase().replace(/\s+/g, "-"),
            name: body.recipename,
            ingredients: body.ingredients.split(","),
            ingredients_with_measurements: (body.measurements || "").split(","),
            directions: (body.instructions || "").split(","),
            image_url: body.image || "",
        };

        const filePath = path.join(process.cwd(), "server/src/data/recipes.json");
        const existingData = fs.existsSync(filePath)
            ? JSON.parse(fs.readFileSync(filePath, "utf8"))
            : [];

        existingData.push(newRecipe);

        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

        recipesData.push(newRecipe);

        return res.status(201).json({ success: true, recipe: newRecipe });
    });

    router.post("/matches", (req, res) => {
        const pantry = req.body?.ingredients;
        if (!Array.isArray(pantry)) {
            return res.status(400).json({ error: "Body must include ingredients: string[]" });
        }

        const maxMissing = Number(req.body?.maxMissing ?? 2);
        const result = matchRecipes(recipesData, pantry, { maxMissing });
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