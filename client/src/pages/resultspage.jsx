import { useEffect, useState } from "react";
import RecipeCard from "../components/recipecard.jsx";
import { fetchMyPantryIngredientNames } from "../api/pantryApi";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const [pantryNames, setPantryNames] = useState([]);
  const [matches, setMatches] = useState({ exactMatches: [], partialMatches: [] });
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setStatus("loading");

        // 1) Pantry from Supabase
        const names = await fetchMyPantryIngredientNames();
        setPantryNames(names);

        const res = await fetch("/api/recipes/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients: names, maxMissing: 2 })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch recipe matches");

        setMatches(data);
        setStatus("success");
      } catch (err) {
        setErrorMsg(err?.message || "Something went wrong");
        setStatus("error");
      }
    }

    load();
  }, []);

  if (status === "loading") return <div style={{ padding: 40 }}>Loading results...</div>;

  if (status === "error") {
    return (
      <div style={{ padding: 40 }}>
        <h2>Error</h2>
        <p style={{ color: "crimson" }}>{errorMsg}</p>
      </div>
    );
  }

  const exactSingle = matches.exactMatches.length === 1;
  const partialSingle = matches.partialMatches.length === 1;

  return (
    <div style={{ padding: 40 }}>
      <h1>Results</h1>

      <p>
        <strong>Your pantry:</strong>{" "}
        {pantryNames.length ? pantryNames.join(", ") : "No ingredients found"}
      </p>

      <h2 className="section-title exact" style={{ marginTop: 24 }}>
        Exact Matches
      </h2>

      {matches.exactMatches.length === 0 ? (
        <p>No exact matches yet.</p>
      ) : (
        <div className={`results-grid ${exactSingle ? "single" : ""}`}>
          {matches.exactMatches.map((r) => (
            <RecipeCard
              key={r.id}
              title={r.name}
              cookTime={r.timeMinutes ? `${r.timeMinutes} min` : ""}
              variant="exact"
              ingredientsText={(r.ingredients_with_measurements?.slice(0, 3) || r.ingredients || []).join(", ")}
              imageUrl={r.image_url || ""}
              onView={() => navigate(`/recipe/${r.id}`, { state: { recipe: r } })}
            />
          ))}
        </div>
      )}

      <h2 className="section-title partial" style={{ marginTop: 24 }}>
        Close Matches
      </h2>

      {matches.partialMatches.length === 0 ? (
        <p>No partial matches yet.</p>
      ) : (
        <div className={`results-grid ${partialSingle ? "single" : ""}`}>
          {matches.partialMatches.map(({ recipe, missing, matchPct }) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.name}
              cookTime={recipe.timeMinutes ? `${recipe.timeMinutes} min` : ""}
              variant="partial"
              missingText={`Missing: ${missing.join(", ")}`}
              matchPercent={`Match: ${matchPct}%`}
              matchPctNumber={matchPct}
              ingredientsText={(recipe.ingredients_with_measurements?.slice(0, 3) || recipe.ingredients || []).join(", ")}
              imageUrl={recipe.image_url || ""}
              onView={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}