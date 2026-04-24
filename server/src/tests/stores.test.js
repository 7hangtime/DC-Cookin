import express from "express";
import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";

import storesRouter from "../routes/stores.js";

let app;

const TEST_STORE_ID = "cdce8a45-766a-4a4d-8605-218dfb89bc85"; // Target (your DB)

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/api/stores", storesRouter);
});

describe("Stores Endpoints", () => {

  it("GET / should return all stores", async () => {
    const res = await request(app).get("/api/stores");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThan(0);
  });


  it("GET /:id/inventory should return store inventory", async () => {
    const res = await request(app).get(
      `/api/stores/${TEST_STORE_ID}/inventory`
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });


  it("GET /:id/inventory should handle empty inventory", async () => {
    const EMPTY_STORE_ID = "00000000-0000-0000-0000-000000000000";

    const res = await request(app).get(
      `/api/stores/${EMPTY_STORE_ID}/inventory`
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });




});
