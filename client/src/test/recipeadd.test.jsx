import { describe, it, expect, beforeAll, afterAll } from "vitest";
import RecipeAdd  from "../pages/recipeadd.jsx";
import { addRecipe } from "../api/addrecipeApi.js";

describe("Recipe Add", () => {
    it ("Adds Recipe with Valid Submission", async () => {

        const fields = {
            recipename: "Pasta",
            ingredients: "Noodles",
            measurements: "2 Noodles",
            instructions: "Boil Noodles",
            image: "img.jpg",
        }

        const res = await request(app).post("/api/recipes/add").send(fields);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTypeOf("object");
        expect(res.body[0]).toHaveProperty("id", "pasta");
    });

    it ("Throws Error with Missing Entries", async () => {

        const fields = {
            recipename: "",
            ingredients: "",
            measurements: "s",
            instructions: "",
            image: ""
        }

        const res = await request(app).post("/api/recipes/add").send(fields);
        expect(res.statusCode.toBe(400));
        expect(res.body).toHaveProperty("error");
    });
});