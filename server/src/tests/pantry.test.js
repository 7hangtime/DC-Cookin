import express from "express";
import request from "supertest";
import pantryRouter from "../routes/pantry.js"; // your router
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const TEST_USER_ID = "6eb9b5a9-2111-4124-a019-14c4a705ada0"; // your test user id

let app;
let testIngredientId;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/api/pantry", pantryRouter);
});

describe("Pantry Endpoints", () => {
  it("GET / should return pantry items", async () => {
    const res = await request(app).get(`/api/pantry?userId=${TEST_USER_ID}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET / without userId returns 400", async () => {
    const res = await request(app).get("/api/pantry");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /add should add ingredient", async () => {
    const newIngredient = {
      userId: TEST_USER_ID,
      ingredients: [
        {
          id: "ec143338-dabf-4eec-ae3f-7e4c8e229e55",
          ingredient_name: "Apples",
          Preference: 0,
        },
      ],
    };

    const res = await request(app).post("/api/pantry/add").send(newIngredient);
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty("ingredient_name", "Apples");

    // store id for later tests
    testIngredientId = res.body[0].ingredient_id;
  });

  it("PUT /update-preference should update preference", async () => {
    if (!testIngredientId) {
      throw new Error("No ingredient available to update");
    }

    const res = await request(app)
      .put("/api/pantry/update-preference")
      .send({
        userId: TEST_USER_ID,
        ingredientId: testIngredientId,
        Preference: 1,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty("Preference", 1);
  });

  it("DELETE /delete/:userId/:ingredientId should delete an item", async () => {
    if (!testIngredientId) {
      throw new Error("No ingredient available to delete");
    }

    const res = await request(app).delete(
      `/api/pantry/delete/${TEST_USER_ID}/${testIngredientId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });
});
