import { supabase } from "../../supabase";

const BASE_URL = "http://localhost:3001/api";

export async function saveRecipe(recipeId) {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("Not logged in");

    const res = await fetch(`${BASE_URL}/saved-recipes/${recipeId}`, {
        method: "POST",
        headers: {
            "x-user-id": user.id,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Failed to save recipe");
    }

    return data;
}