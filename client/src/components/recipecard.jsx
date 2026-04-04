import "./recipecard.css";

export default function RecipeCard({
  title = "Recipe Name",
  cookTime = "Cook Time",
  matchPercent = "",
  missingText = "",
  ingredientsText = "ingredients",
  imageUrl = "",
  onView,
  variant = "exact",
  matchPctNumber = null,
}) {
  const isExact = variant === "exact";
  const isPartial = variant === "partial";
  const isBrowse = variant === "browse";

  return (
    <div className={`recipe-card ${variant}`}>
      <div className="recipe-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="recipe-card-image-placeholder" />
        )}
      </div>

      <div className="recipe-card-content">
        <div className="recipe-card-header">
          <h3 className="recipe-card-title">{title}</h3>
          <div className="recipe-card-time">⏱ Cook time: {cookTime}</div>
        </div>

        <div className="recipe-card-info">
          {isExact && (
            <div className="recipe-card-status exact">
              <span className="status-icon">✅</span>
              <span>Uses only your ingredients</span>
            </div>
          )}

          {isPartial && (
            <div className="recipe-card-status partial">
              <span className="status-icon">❌</span>
              <span>{missingText}</span>
            </div>
          )}

          {isBrowse && (
            <div className="recipe-card-status browse">
              <span className="status-icon">📖</span>
              <span>Recipe available</span>
            </div>
          )}

          <div className="recipe-card-ingredients">
            <span className="status-icon">🍱</span>
            <span>{ingredientsText}</span>
          </div>

          {isPartial && typeof matchPctNumber === "number" && (
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
          )}

          {(isExact || isBrowse) && (
            <div className="recipe-card-actions">
              <button className={`recipe-card-button ${variant}`} onClick={onView}>
                View Recipe
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}