import RecipeCard from "../components/recipecard.jsx";

function App() {
  return (
    <div style={{ padding: "40px" }}>
      <RecipeCard
        title="Omelette"
        cookTime="10 min"
        matchText="100% ingredient match"
        ingredientsText="Eggs, Butter, Salt"
        onView={() => alert("View clicked")}
      />
    </div>
  );
}

export default App;
