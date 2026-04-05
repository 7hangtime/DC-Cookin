export async function fetchRecipeById(recipeId) {
    const res = await fetch(`/api/recipes/${recipeId}`);

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
        const msg = isJson ? (payload?.error || "Failed to load recipe") : "Server returned non-JSON error";
        throw new Error(msg);
    }

    return payload;
}