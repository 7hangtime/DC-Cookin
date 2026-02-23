import "./recipecard.css";

export default function RecipeCard({
  title = "Recipe Name",
  cookTime = "Cook Time",
  matchPercent = "",        // e.g. "75% match"
  missingText = "",         // e.g. "Missing: milk, eggs"
  ingredientsText = "ingredients",
  imageUrl = "",
  onView,
  variant = "exact",        // "exact" | "partial"
  matchPctNumber = null     // number 0-100 for progress bar (partial)
}) {
  const isExact = variant === "exact";

  return (
    <div className={`recipe-card ${variant}`}>
      <div className="recipe-card-image">
        {imageUrl ? <img src={imageUrl} alt={title} /> : <div className="recipe-card-image-placeholder" />}
      </div>

      <div className="recipe-card-content">
        <div className="recipe-card-header">
          <h3 className="recipe-card-title">{title}</h3>
          <div className="recipe-card-time">⏱ Cook time: {cookTime}</div>
        </div>

        <div className="recipe-card-info">
          {/* Exact vs Partial “status” line */}
          {isExact ? (
            <div className="recipe-card-status exact">
              <span className="status-icon">✅</span>
              <span>Uses only your ingredients</span>
            </div>
          ) : (
            <div className="recipe-card-status partial">
              <span className="status-icon">❌</span>
              <span>{missingText}</span>
            </div>
          )}

          {/* Ingredients line */}
          <div className="recipe-card-ingredients">
            <span className="status-icon">🍱: </span>
            <span>{ingredientsText}</span>
          </div>

          {/* Match percent + progress bar (partials) */}
          {!isExact && typeof matchPctNumber === "number" ? (
            <div className="recipe-card-match-row">
              <div className="recipe-card-match-top">
                <div className="recipe-card-match-text">
                  <span className="status-icon">📈</span>
                  <span>{matchPercent}</span>
                </div>

                <button className={`recipe-card-button ${variant}`} onClick={onView}>
                  View Recipe
                </button>
              </div>

              <div className="recipe-card-progress">
                <div
                  className="recipe-card-progress-fill"
                  style={{ width: `${Math.max(0, Math.min(100, matchPctNumber))}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* Actions (exact only) */}
          {isExact ? (
            <div className="recipe-card-actions">
              <button className={`recipe-card-button ${variant}`} onClick={onView}>
                View Recipe
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}