import { fetchRecipeById } from "../api/recipesApi";

export default function RecipeDetails() {
    //example
    fetchRecipeById("crispy-herb-bread").then(data => {
        console.log(data.name);
    });

    return (
        <div style={{ padding: 40 }}>
            <h1>Recipe Details Coming Soon</h1>
            <p>Chase</p>
        </div>
    );
}