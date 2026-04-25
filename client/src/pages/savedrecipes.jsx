import { useEffect, useMemo, useState } from "react";
import RecipeCard from "../components/recipecard.jsx";
import { useNavigate } from "react-router-dom";

export default function SavedRecipesPage() {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        async function loadSavedRecipes() {
            try {
                setStatus("loading");

                const res = await fetch("http://localhost:3001/api/saved-recipes", {
                    headers: {
                        "x-user-id": userId,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.error || "Failed to fetch saved recipes");
                }

                setSavedRecipes(data);
                setStatus("success");
            } catch (err) {
                setErrorMsg(err?.message || "Something went wrong");
                setStatus("error");
            }
        }

        loadSavedRecipes();
    }, [userId]);

    const filteredRecipes = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) return savedRecipes;

        return savedRecipes.filter((recipe) => {
            const name = recipe.name?.toLowerCase() || "";
            const ingredients =
                recipe.ingredients_with_measurements?.join(" ").toLowerCase() ||
                recipe.ingredients?.join(" ").toLowerCase() ||
                "";

            return name.includes(term) || ingredients.includes(term);
        });
    }, [savedRecipes, searchTerm]);

    async function handleUnsave(recipeId) {
        try {
            const res = await fetch(`http://localhost:3001/api/saved-recipes/${recipeId}`, {
                method: "DELETE",
                headers: {
                    "x-user-id": userId,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to unsave recipe");
            }

            setSavedRecipes((currentRecipes) =>
                currentRecipes.filter((recipe) => recipe.id !== recipeId)
            );
        } catch (err) {
            setErrorMsg(err?.message || "Failed to unsave recipe");
            setStatus("error");
        }
    }

    if (status === "loading") {
        return <div style={{ padding: 40 }}>Loading saved recipes...</div>;
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
                <div className="results-shell-header saved-recipes-header">
                    <div className="results-shell-title-row">
                        <span className="results-shell-icon" aria-hidden="true">⭐</span>
                        <h2 className="results-shell-title">Saved Recipes</h2>
                    </div>

                    <div className="results-shell-subtitle">
                        {filteredRecipes.length} saved recipe{filteredRecipes.length !== 1 ? "s" : ""}
                    </div>
                </div>

                <div className="results-shell-body">
                    <div className="recipes-search-wrap">
                        <input
                            type="text"
                            className="recipes-search-input"
                            placeholder="Search saved recipes by name or ingredient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {savedRecipes.length === 0 ? (
                        <p>You have not saved any recipes yet.</p>
                    ) : filteredRecipes.length === 0 ? (
                        <p>No saved recipes matched your search.</p>
                    ) : (
                        <div className={`results-grid ${single ? "single" : ""}`}>
                            {filteredRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    title={recipe.name}
                                    cookTime={recipe.timeMinutes ? `${recipe.timeMinutes} min` : ""}
                                    variant="saved"
                                    ingredientsText={
                                        (
                                            recipe.ingredients_with_measurements?.slice(0, 3) ||
                                            recipe.ingredients ||
                                            []
                                        ).join(", ")
                                    }
                                    imageUrl={recipe.image_url || ""}
                                    onView={() =>
                                        navigate(`/recipe/${recipe.id}`, { state: { recipe } })
                                    }
                                    showUnsaveButton={true}
                                    onUnsave={() => handleUnsave(recipe.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}