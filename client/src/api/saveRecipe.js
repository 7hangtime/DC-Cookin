export async function saveRecipe(recipeId, userId) {
    const res = await fetch(`http://localhost:3001/api/saved-recipes/${recipeId}`, {
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