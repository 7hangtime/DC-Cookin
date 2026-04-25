import "./recipecard.css";
import { useEffect, useState } from "react";

export default function RecipeCard({
  title = "Recipe Name",
  recipeId,
  cookTime = "Cook Time",
  matchPercent = "",
  missingText = "",
  ingredientsText = "ingredients",
  imageUrl = "",
  onView,
  onSave,
  onUnsave,
  variant = "exact",
  matchPctNumber = null,
  showSaveButton = false,
  showUnsaveButton = false,
}) {
  const isExact = variant === "exact";
  const isPartial = variant === "partial";
  const isBrowse = variant === "browse";
  const isSaved = variant === "saved";
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    async function fetchAverage() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/reviews/${recipeId}/average`
        );
        if (!res.ok) throw new Error("Failed to fetch rating");

        const data = await res.json();
        setAvgRating(data.average_rating);
        setReviewCount(data.review_count);
      } catch (err) {
        console.error(err);
      }
    }

    if (recipeId) fetchAverage();
  }, [recipeId]);

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
          <h3 className="recipe-card-title">{title}
            {avgRating !== null ? (
              <p>⭐ {avgRating.toFixed(1)} ({reviewCount})</p>
            ) : (
              <p>⭐0.0 (0)</p>
            )}
          </h3>
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

          {isSaved && (
            <div className="recipe-card-status saved">
              <span className="status-icon">⭐</span>
              <span>Saved recipe</span>
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

                <div className="recipe-card-actions inline">
                  {showSaveButton && (
                    <button className="recipe-card-button save" onClick={onSave}>
                      <span className="recipe-card-button-icon">🔖</span>
                      Save Recipe
                    </button>
                  )}

                  <button className={`recipe-card-button ${variant}`} onClick={onView}>
                    View Recipe
                  </button>
                </div>
              </div>

              <div className="recipe-card-progress">
                <div
                  className="recipe-card-progress-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, matchPctNumber))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {(isExact || isBrowse || isSaved) && (
            <div className="recipe-card-actions">
              {showSaveButton && (
                <button className="recipe-card-button save" onClick={onSave}>
                  <span className="recipe-card-button-icon">🔖</span>
                  Save Recipe
                </button>
              )}

              <button className={`recipe-card-button ${variant}`} onClick={onView}>
                View Recipe
              </button>

              {showUnsaveButton && (
                <button className="recipe-card-button unsave" onClick={onUnsave}>
                  Unsave Recipe
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}