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
      ),
      Preference
    `)
        .eq("user_id", user.id);

    if (error) throw error;

    return (data ?? [])
      .map(r => ({
        name: r.ingredients?.ingredient_name?.toLowerCase().trim(),
        preference: r.Preference
      })).filter(item => item.name)
}