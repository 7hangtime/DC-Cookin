import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function Pantry() {
  const [user, setUser] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [newIngredient, set.history/client/src/pages/pantry_20260223003435.jsx