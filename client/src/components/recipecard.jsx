import "./recipecard.css";

export default function RecipeCard({
  title = "Recipe Name",
  cookTime = "Cook Time",
  matchText = "ingredient match",
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
            ⏱ {cookTime}
          </div>
        </div>

        <div className="recipe-card-info">  
          <div>{matchText}</div>
          <div>{ingredientsText}</div>
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
