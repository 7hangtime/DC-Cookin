import { supabase } from "../../supabase";

export async function fetchMyPantryIngredientNames() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error("Not logged in");

    const { data, error } = await supabase
        .from("pantry")
        .select(`
      ingredients:ingredient_id (
        ingredient_name
      )
    `)
        .eq("user_id", user.id);

    if (error) throw error;

    return (data ?? [])
        .map(r => r.ingredients?.ingredient_name)
        .filter(Boolean)
        .map(name => name.toLowerCase().trim());
}