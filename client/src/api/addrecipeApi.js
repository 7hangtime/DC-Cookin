export async function addRecipe(data) {
    const res = await fetch("/api/recipes/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const recipe = await res.json();

        if (!res.ok) {
            throw new Error(recipe.error || "Failed to add recipe");
        }

        alert("Recipe added!");
        return recipe;
};