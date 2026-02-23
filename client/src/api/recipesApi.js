export async function fetchRecipeById(recipeId) {
    const res = await fetch(`/api/recipes/${recipeId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to load recipe");
    return data;
}