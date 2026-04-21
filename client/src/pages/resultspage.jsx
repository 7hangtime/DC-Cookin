import { useEffect, useState, useMemo } from "react";
import RecipeCard from "../components/recipecard.jsx";
import { fetchMyPantryIngredientNames } from "../api/pantryApi";
import { useNavigate } from "react-router-dom";

export const SEARCH_SUGGESTIONS = ["Soup", "Sandwich", "Burger", "Salad", "Pie", "Cake", "Cookie", "Candy"];

export default function ResultsPage() {
  const [pantryNames, setPantryNames] = useState([]);
  const [matches, setMatches] = useState({ exactMatches: [], partialMatches: [] });
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const[searchTerm, setSearchTerm] = useState('');
   
  useEffect(() => {
    async function load() {
      try {
        setStatus("loading");

        // 1) Pantry from Supabase
        const pantryItems = await fetchMyPantryIngredientNames();
        const names = pantryItems.map(p => p.name);
        setPantryNames(names);

        const preferencesMap = {};
        pantryItems.forEach(p => {
            if (p.preference !== undefined) {
              preferencesMap[p.name] = p.preference;
            }
          }
        )

        const res = await fetch("http://localhost:3001/api/recipes/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            ingredients: names,
            maxMissing: 3,
            preferences: preferencesMap
          }),
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

  const filteredExact = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matches.exactMatches;

    return matches.exactMatches.filter((r) => {
        const name = r.name?.toLowerCase() || "";
        return name.includes(term) ;
    });
}, [matches.exactMatches, searchTerm]);

const filteredPartial = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matches.partialMatches;

    return matches.partialMatches.filter(({ recipe }) => {
        const name = recipe.name?.toLowerCase() || "";
        return name.includes(term);
    });
}, [matches.partialMatches, searchTerm]);

  if (status === "loading") return <div style={{ padding: 40 }}>Loading results...</div>;

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

        {/* Search Bar*/}
        <div className="recipes-search-wrap"
          style={{ paddingTop: "25px"}} >
            <input
                type="text"
                className="recipes-search-input"
                placeholder="Search by recipe name or ingredient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* quick search*/}
        <div style={{
          display: "flex",
          gap: "8px"
        }}>
          {SEARCH_SUGGESTIONS.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
            >
              {tag}
            </button>
          ))}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{color:"black", backgroundColor:"crimson"}}
            >
              Clear
            </button>
          )}
        </div>

        {/* Body */}
        
        <div className="results-shell-body">
          <h3 className="section-title exact" style={{ marginTop: 0 }}>
            Exact Matches
          </h3>

          {filteredExact.length === 0 ? (
            <p>No exact matches yet.</p>
          ) : (
            <div className={`results-grid ${exactSingle ? "single" : ""}`}>
              {filteredExact.map((r) => (
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

          <h3 className="section-title partial" style={{ marginTop: 22 }}>
            Missing Ingredients
          </h3>

          {filteredPartial.length === 0 ? (
            <p>No partial matches yet.</p>
          ) : (
            <div className={`results-grid ${partialSingle ? "single" : ""}`}>
              {filteredPartial.map(({ recipe, missing, matchPct }) => (
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
      </div>
    </div>
  );
}