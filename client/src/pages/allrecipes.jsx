import { useEffect, useMemo, useState } from "react";
import RecipeCard from "../components/recipecard.jsx";
import { useNavigate } from "react-router-dom";
import { SEARCH_SUGGESTIONS, DIET_SUGGESTIONS } from "./resultspage.jsx";
import { fetchMySavedRecipes, saveRecipe } from "../api/saveRecipe.js";

export default function AllRecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipeIds, setSavedRecipeIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dietType, setDietType] = useState("None");

    const [status, setStatus] = useState("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function loadRecipes() {
            try {
                setStatus("loading");

                const res = await fetch("http://localhost:3001/api/recipes");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.error || "Failed to fetch recipes");
                }

                const savedRecipes = await fetchMySavedRecipes();
                const savedIds = savedRecipes.map((recipe) => recipe.id);

                setRecipes(data);
                setSavedRecipeIds(savedIds);
                setStatus("success");
            } catch (err) {
                setErrorMsg(err?.message || "Something went wrong");
                setStatus("error");
            }
        }

        loadRecipes();
    }, []);

    const filteredRecipes = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        let filtered = recipes;

        if (term) {
            filtered = filtered.filter((recipe) => {
                const name = recipe.name?.toLowerCase() || "";
                const ingredients =
                    recipe.ingredients_with_measurements?.join(" ").toLowerCase() ||
                    recipe.ingredients?.join(" ").toLowerCase() ||
                    "";

                return name.includes(term) || ingredients.includes(term);
            });
        }

        if (dietType !== "None") {
            filtered = filtered.filter((recipe) => {
                const dietTags = recipe.dietType || recipe.diet || recipe.diets || [];

                if (Array.isArray(dietTags)) {
                    return dietTags
                        .map((tag) => String(tag).toLowerCase())
                        .includes(dietType.toLowerCase());
                }

                return String(dietTags).toLowerCase() === dietType.toLowerCase();
            });
        }

        return filtered;
    }, [recipes, searchTerm, dietType]);

    async function handleSaveRecipe(recipeId) {
        try {
            await saveRecipe(recipeId);

            setSavedRecipeIds((currentIds) => {
                if (currentIds.includes(recipeId)) {
                    return currentIds;
                }

                return [...currentIds, recipeId];
            });
        } catch (err) {
            console.error("Failed to save recipe:", err);
        }
    }

    if (status === "loading") {
        return <div style={{ padding: 40 }}>Loading recipes...</div>;
    }

    if (status === "error") {
        return (
            <div style={{ padding: 40 }}>
                <h2>Error</h2>
                <p style={{ color: "crimson" }}>{errorMsg}</p>
            </div>
        );
    }

    const single = filteredRecipes.length === 1;

    return (
        <div style={{ padding: 40 }}>
            <div className="results-shell">
                <div className="results-shell-header">
                    <div className="results-shell-title-row">
                        <span className="results-shell-icon" aria-hidden="true">🥑</span>
                        <h2 className="results-shell-title">Browse Recipes</h2>
                    </div>

                    <div className="results-shell-subtitle">
                        {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""}
                    </div>
                </div>

                <div className="results-shell-body">
                    <div className="recipes-search-wrap">
                        <input
                            type="text"
                            className="recipes-search-input"
                            placeholder="Search by recipe name or ingredient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* quick search */}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            paddingBottom: "8px",
                        }}
                    >
                        {SEARCH_SUGGESTIONS.map((tag) => (
                            <button key={tag} onClick={() => setSearchTerm(tag)}>
                                {tag}
                            </button>
                        ))}

                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                style={{ color: "black", backgroundColor: "crimson" }}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* diet options */}
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            position: "relative",
                            left: "1500px",
                            paddingBottom: "12px",
                        }}
                    >
                        {DIET_SUGGESTIONS.map((tag) => (
                            <button
                                style={{
                                    borderRadius: "15px",
                                    backgroundColor: "darkgray",
                                }}
                                key={tag}
                                onClick={() => setDietType(tag)}
                            >
                                {tag}
                            </button>
                        ))}

                        {dietType !== "None" && (
                            <button
                                onClick={() => setDietType("None")}
                                style={{ color: "black", backgroundColor: "crimson" }}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {filteredRecipes.length === 0 ? (
                        <p>No recipes matched your search.</p>
                    ) : (
                        <div className={`results-grid ${single ? "single" : ""}`}>
                            {filteredRecipes.map((recipe) => {
                                const isSaved = savedRecipeIds.includes(recipe.id);

                                return (
                                    <RecipeCard
                                        key={recipe.id}
                                        title={recipe.name}
                                        cookTime={recipe.timeMinutes ? `${recipe.timeMinutes} min` : ""}
                                        variant={isSaved ? "saved" : "browse"}
                                        ingredientsText={(
                                            recipe.ingredients_with_measurements?.slice(0, 3) ||
                                            recipe.ingredients ||
                                            []
                                        ).join(", ")}
                                        imageUrl={recipe.image_url || ""}
                                        showSaveButton={!isSaved}
                                        onSave={() => handleSaveRecipe(recipe.id)}
                                        onView={() =>
                                            navigate(`/recipe/${recipe.id}`, { state: { recipe } })
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}