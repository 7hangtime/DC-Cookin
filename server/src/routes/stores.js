import express from "express";
import { supabase } from "../../supabase.js";
import fs from "fs";
import path from "path";
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

export default router;