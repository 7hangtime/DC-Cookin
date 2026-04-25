import express from "express";
import { supabase } from "../../supabase.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("ingredient_name", { ascending: true });

  if (error) return res.status(500).json({ error });
  res.json(data);
});



export default router;
