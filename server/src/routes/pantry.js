import express from "express";
import { supabase } from "../../supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.query.userId;

  const { data, error } = await supabase
    .from("pantry")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

export default router;
