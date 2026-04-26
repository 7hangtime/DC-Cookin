import { useEffect, useState, useMemo } from "react";
import RecipeCard from "../components/recipecard.jsx";
import { fetchMyPantryIngredientNames } from "../api/pantryApi";
import { fetchMySavedRecipes, saveRecipe } from "../api/saveRecipe.js";
import { useNavigate } from "react-router-dom";

export const SEARCH_SUGGESTIONS = ["Soup", "Burger", "Salad", "Pie", "Cake", "Cookie", "Candy"];
export const DIET_SUGGESTIONS = ["Vegan", "Paleo", "Carnivore"];

export default function ResultsPage() {
  const [pantryNames, setPantryNames] = useState([]);
  const [matches, setMatches] = useState({ exactMatches: [], partialMatches: [] });
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [dietType, setDietType] = useState("None");

  useEffect(() => {
    async function load() {
      try {
        setStatus("loading");

        // 1) Pantry from Supabase
        const pantryItems = await fetchMyPantryIngredientNames();
        const names = pantryItems.map((p) => p.name);
        setPantryNames(names);

        const preferencesMap = {};
        pantryItems.forEach((p) => {
          if (p.preference != null && p.preference !== undefined) {
            preferencesMap[p.name] = p.preference;
          }
        });

        // 2) Recipe matches from Express
        const res = await fetch("http://localhost:3001/api/recipes/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredients: names,
            maxMissing: 3,
            preferences: preferencesMap,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch recipe matches");
        }

        // 3) Saved recipes from your saved-recipes endpoint/helper
        const savedRecipes = await fetchMySavedRecipes();
        const savedIds = savedRecipes.map((recipe) => recipe.id);

        setMatches(data);
        setSavedRecipeIds(savedIds);
        setStatus("success");
      } catch (err) {
        setErrorMsg(err?.message || "Something went wrong");
        setStatus("error");
      }
    }

    load();
  }, []);

  const filteredExact = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let filtered = matches.exactMatches;

    if (term) {
      filtered = filtered.filter((r) => {
        const name = r.name?.toLowerCase() || "";
        const ingredients =
          r.ingredients_with_measurements?.join(" ").toLowerCase() ||
          r.ingredients?.join(" ").toLowerCase() ||
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
  }, [matches.exactMatches, searchTerm, dietType]);

  const filteredPartial = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let filtered = matches.partialMatches;

    if (term) {
      filtered = filtered.filter(({ recipe }) => {
        const name = recipe.name?.toLowerCase() || "";
        const ingredients =
          recipe.ingredients_with_measurements?.join(" ").toLowerCase() ||
          recipe.ingredients?.join(" ").toLowerCase() ||
          "";

        return name.includes(term) || ingredients.includes(term);
      });
    }

    if (dietType !== "None") {
      filtered = filtered.filter(({ recipe }) => {
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
  }, [matches.partialMatches, searchTerm, dietType]);

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
    return <div style={{ padding: 40 }}>Loading results...</div>;
  }

  if (status === "error") {
    return (
      <div style={{ padding: 40 }}>
        <h2>Error</h2>
        <p style={{ color: "crimson" }}>{errorMsg}</p>
      </div>
    );
  }

  const exactSingle = filteredExact.length === 1;
  const partialSingle = filteredPartial.length === 1;

  return (
    <div style={{ padding: 40 }}>
      <div className="results-shell">
        {/* Blue top header band */}
        <div className="results-shell-header">
          <div className="results-shell-title-row">
            <span className="results-shell-icon" aria-hidden="true">🥑</span>
            <h2 className="results-shell-title">Recipes for Your Pantry</h2>
          </div>

          <div className="results-shell-subtitle">
            {filteredExact.length} exact matches • {filteredPartial.length} partial matches
          </div>
        </div>

        {/* Search Bar */}
        <div className="recipes-search-wrap" style={{ paddingTop: "25px" }}>
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
            gap: "8px",
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
        {/* <div
          style={{
            display: "flex",
            gap: "8px",
            position: "absolute",
            right: "120px",
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
        </div> */}

        {/* Body */}
        <div className="results-shell-body">
          <h3 className="section-title exact" style={{ marginTop: 0 }}>
            Exact Matches
          </h3>

          {filteredExact.length === 0 ? (
            <p>No exact matches yet.</p>
          ) : (
            <div className={`results-grid ${exactSingle ? "single" : ""}`}>
              {filteredExact.map((r) => {
                const isSaved = savedRecipeIds.includes(r.id);

                return (
                  <RecipeCard
                    key={r.id}
                    title={r.name}
                    cookTime={r.timeMinutes ? `${r.timeMinutes} min` : ""}
                    variant={isSaved ? "saved" : "exact"}
                    ingredientsText={(
                      r.ingredients_with_measurements?.slice(0, 3) ||
                      r.ingredients ||
                      []
                    ).join(", ")}
                    imageUrl={r.image_url || ""}
                    showSaveButton={!isSaved}
                    onSave={() => handleSaveRecipe(r.id)}
                    onView={() => navigate(`/recipe/${r.id}`, { state: { recipe: r } })}
                  />
                );
              })}
            </div>
          )}

          <h3 className="section-title partial" style={{ marginTop: 22 }}>
            Missing Ingredients
          </h3>

          {filteredPartial.length === 0 ? (
            <p>No partial matches yet.</p>
          ) : (
            <div className={`results-grid ${partialSingle ? "single" : ""}`}>
              {filteredPartial.map(({ recipe, missing, matchPct }) => {
                const isSaved = savedRecipeIds.includes(recipe.id);

                return (
                  <RecipeCard
                    key={recipe.id}
                    recipeId={recipe.id}
                    title={recipe.name}
                    cookTime={recipe.timeMinutes ? `${recipe.timeMinutes} min` : ""}
                    variant={isSaved ? "saved" : "partial"}
                    missingText={`Missing: ${missing.join(", ")}`}
                    matchPercent={`Match: ${matchPct}%`}
                    matchPctNumber={matchPct}
                    ingredientsText={(
                      recipe.ingredients_with_measurements?.slice(0, 3) ||
                      recipe.ingredients ||
                      []
                    ).join(", ")}
                    imageUrl={recipe.image_url || ""}
                    showSaveButton={!isSaved}
                    onSave={() => handleSaveRecipe(recipe.id)}
                    onView={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
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