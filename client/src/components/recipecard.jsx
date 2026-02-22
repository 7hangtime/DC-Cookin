import "./recipecard.css";

export default function RecipeCard({
  title = "Recipe Name",
  cookTime = "Cook Time",
  matchPercent = "",
  missingText = "",
  ingredientsText = "ingredients",
  imageUrl = "",
  onView
}) {
  return (
    <div className="recipe-card">

      <div className="recipe-card-image">
        {imageUrl ?
          <img src={imageUrl} alt={title} /> : null}
      </div>

      <div className="recipe-card-content">

        <div className="recipe-card-header">
          <h3>{title}</h3>
          <div className="recipe-card-time">
            ⏱ Cook Time: {cookTime}
          </div>
        </div>

        <div className="recipe-card-info">
          {matchPercent && (
            <div className="recipe-card-match">
              {matchPercent}
            </div>
          )}

          {missingText && (
            <div className="recipe-card-missing">
              {missingText}
            </div>
          )}

          <div className="recipe-card-ingredients">
            {ingredientsText}
          </div>
        </div>

        <div className="recipe-card-actions">
          <button onClick={onView}>
            View Recipe
          </button>
        </div>

      </div>

    </div>
  );
}
