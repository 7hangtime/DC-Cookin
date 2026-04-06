import express from "express";
import { supabase } from "../../supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "User must be logged in!" });
  }
  const { data, error } = await supabase
    .from("pantry")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Add/Update pantry items
router.post("/add", async (req, res) => {
    const { userId, ingredients } = req.body;
    if (!userId || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: "userId and ingredients array required" });
    }

    const { data, error } = await supabase
        .from("pantry")
        .upsert(ingredients.map(i => ({
            user_id: userId,
            ingredient_id: i.id,
            ingredient_name: i.ingredient_name,
            Preference: i.Preference
        })), { onConflict: ["user_id", "ingredient_id"] })
        .select();

    if (error) return res.status(500).json({ error });
    return res.json(data);
});

// Delete pantry item
router.delete("/delete/:userId/:ingredientId", async (req, res) => {
    const { userId, ingredientId } = req.params;
    if (!userId) {
   return res.status(400).json({ error: "userId is required" });
    }

    const { error } = await supabase
        .from("pantry")
        .delete()
        .eq("user_id", userId)
        .eq("ingredient_id", ingredientId);

    if (error) return res.status(500).json({ error });
    return res.json({ success: true });
});

// Update preference of a pantry item
router.put("/update-preference", async (req, res) => {
  const { userId, ingredientId, Preference } = req.body;
  if (!userId || !ingredientId || Preference === undefined) {
    return res
      .status(400)
      .json({ error: "userId, ingredientId, and Preference are required" });
  }

  const { data, error } = await supabase
    .from("pantry")
    .update({ Preference })
    .eq("user_id", userId)
    .eq("ingredient_id", ingredientId)
    .select();

  if (error) return res.status(500).json({ error });
  return res.json(data);
});


export default router;
