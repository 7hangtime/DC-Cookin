import { supabase } from "../../supabase";

async function getCurrentUserId() {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error("Not logged in");

    return user.id;
}

export async function fetchMySavedRecipes() {
    const userId = await getCurrentUserId();

    const res = await fetch('http://localhost:3001/api/saved-recipes', {
        headers: {
            "x-user-id": userId,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch saved recipes");
    }

    return data;
}

export async function saveRecipe(recipeId) {
    const userId = await getCurrentUserId();

    const res = await fetch('http://localhost:3001/api/saved-recipes/${recipeId}', {
        method: "POST",
        headers: {
            "x-user-id": userId,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Failed to save recipe");
    }

    return data;
}

export async function removeSavedRecipe(recipeId) {
    const userId = await getCurrentUserId();

    const res = await fetch('http://localhost:3001/api/saved-recipes/${recipeId}', {
        method: "DELETE",
        headers: {
            "x-user-id": userId,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to unsave recipe");
    }
}