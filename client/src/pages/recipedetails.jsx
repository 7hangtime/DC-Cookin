import React, { useEffect, useState } from "react"; // Importing React and necessary hooks
import { useParams, useNavigate } from "react-router-dom"; // Importing hooks from react-router-dom

/*
The purpose of this code is to display a recipe's details on a webpage. It fetches the recipe data from an API, handles loading and error states, and renders the recipe information in a visually appealing format. The recipe details include the recipe name, image, ingredients, and instructions. That way the user can view the recipe details and navigate back to the previous page. 
- Chase
*/

const API_BASE = "/api";


// RecipeDetails component displays detailed information about a specific recipe
export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([
    { user: "Alice", rating: 5, comment: "Loved this recipe!" },
    { user: "Bob", rating: 4, comment: "Very tasty, easy to make." },
  ]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  const handleAddReview = () => {
    if (!newComment) return;
    setReviews([
      ...reviews,
      { user: "You", rating: newRating, comment: newComment },
    ]);
    setNewComment("");
    setNewRating(5);
  };

  // We fetch the recipe data from the API using the recipe ID from the URL parameters.
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(
          `http://localhost:3001${API_BASE}/recipes/${id}`
        );
        if (!res.ok) throw new Error("Recipe not found");
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  // We handle loading and error states, and render the recipe details if the data is available.
  if (loading) return <div style={styles.centered}>Loading recipe...</div>;
  if (error) return <div style={styles.centered}>Error: {error}</div>;
  if (!recipe) return null;
  // We render the recipe details in a visually appealing format, including the recipe name, image, ingredients, and instructions.
  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate(-1)}>
        ← Back
      </button>
      {/* Recipe Card */}
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              style={styles.image}
            /> // Recipe image
          ) : (
            <div style={styles.imagePlaceholder}>
              <span style={styles.placeholderIcon}>🍽️</span>
            </div>
          )}
          <h1 style={styles.title}>{recipe.name}</h1>
        </div>
        {/* Body */}
        <div style={styles.body}>
          {/* Ingredients */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ingredients</h2>
            <ul style={styles.list}>
              {(
                recipe.ingredients_with_measurements ||
                recipe.ingredients ||
                []
              ).map((ing, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.bullet}>•</span>
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          {/* Directions */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Instructions</h2>
            <ol style={styles.orderedList}>
              {(recipe.directions || []).map((step, i) => (
                <li key={i} style={styles.step}>
                  <span style={styles.stepNumber}>{i + 1}</span>
                  <p style={styles.stepText}>{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      <div style={styles.contentContainer}>
        <div style={styles.card}></div>

        {/* Reviews */}
        <section style={styles.sectionReviews}>
          <h2 style={styles.sectionTitle}>Reviews & Ratings</h2>

          <div style={styles.averageRating}>
            <span style={styles.stars}>★★★★☆</span>
            <span style={styles.ratingText}>4.6 (12 reviews)</span>
          </div>

          <ul style={styles.list}>
            <li style={styles.reviewItem}>
              <div style={styles.reviewHeader}>
                <strong>Alice</strong> - ★★★★★
              </div>
              <p>Loved this recipe!</p>
            </li>
            <li style={styles.reviewItem}>
              <div style={styles.reviewHeader}>
                <strong>Bob</strong> - ★★★★☆
              </div>
              <p>Very tasty, easy to make.</p>
            </li>
          </ul>

          <div style={styles.newReview}>
            <textarea
              placeholder="Add your review..."
              style={styles.textarea}
            />
            <label style={styles.label}>
              Rating:
              <select style={styles.select}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ⭐
                  </option>
                ))}
              </select>
            </label>
            <button style={styles.submitButton}>Submit Review</button>
          </div>
        </section>
      </div>
    </div>
  );
}
// Styles for the RecipeDetails component. We use inline styles for simplicity and also for better control over the styling.
const styles = {
  page: {
    // This block is used for the overall page layout.
    minHeight: "100vh",
    backgroundColor: "#f7c6a5e1", //"#ffe5d4" "#f7c6a5e1" "#eeaf9b"
    padding: "2rem",
    fontFamily: "'Georgia', serif",
    color: "#2c2c2c",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  centered: {
    // This block is used for centering content on the page.
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "Georgia, serif",
    fontSize: "1.2rem",
    color: "#555",
  },
  back: {
    // This block is used for the back button.
    alignSelf: "flex-start",
    background: "none",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#7a402e",
    fontFamily: "Georgia, serif",
    marginBottom: "1.5rem",
    padding: "0",
    fontWeight: "bold",
  },
  card: {
    // This block is used for the recipe card.
    backgroundColor: "#fffdf8",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(245, 164, 164, 0.73)",
    maxWidth: "720px",
    width: "100%",
    overflow: "hidden",
  },
  header: {
    // This block is used for the header of the recipe card.
    backgroundColor: "#c07942", //  "#7a4f2e" "#c07942" "#c57373"
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  image: {
    // This block is used for the recipe image.
    width: "100%",
    maxHeight: "280px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  imagePlaceholder: {
    // This block is used for the placeholder image.
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    // This block is used for the placeholder icon.
    fontSize: "3rem",
  },
  title: {
    // This block is used for the recipe title.
    color: "#fff",
    fontSize: "2rem",
    margin: "0",
    textAlign: "center",
    fontFamily: "Georgia, serif",
    letterSpacing: "0.02em",
  },
  body: {
    // This block is used for the body of the recipe card.
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  section: {},
  sectionTitle: {
    // This block is used for the section titles.
    fontSize: "1.1rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#7a4f2e",
    borderBottom: "2px solid #e8dcc8",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
    fontFamily: "Georgia, serif",
  },
  list: {
    // This block is used for the list of ingredients.
    listStyle: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  listItem: {
    // This block is used for the list items.
    display: "flex",
    alignItems: "flex-start",
    gap: "0.6rem",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
  bullet: {
    // This block is used for the bullet points.
    color: "#7a4f2e",
    fontWeight: "bold",
    flexShrink: 0,
  },
  orderedList: {
    // This block is used for the ordered list of instructions.
    listStyle: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  step: {
    // This block is used for the steps in the instructions.
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  stepNumber: {
    // This block is used for the step numbers.
    backgroundColor: "#7a4f2e",
    color: "#fff",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "bold",
    flexShrink: 0,
    marginTop: "2px",
  },
  stepText: {
    // This block is used for the step text.
    margin: "0",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#333",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // left-align everything
    width: "100%",
    maxWidth: "720px", // same as card
  },
  sectionReviews: {
    width: "100%",
    marginTop: "2rem",
  },
  averageRating: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    fontFamily: "Georgia, serif",
  },
  stars: {
    color: "#f5a623",
    fontSize: "1.2rem",
  },
  ratingText: {
    marginLeft: "0.5rem",
    fontSize: "1rem",
    color: "#333",
  },
  reviewItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.3rem",
    marginBottom: "0.8rem",
  },
  reviewHeader: {
    fontSize: "0.95rem",
  },
  newReview: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  textarea: {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
  },
  label: {
    fontSize: "0.95rem",
  },
  select: {
    marginLeft: "0.5rem",
  },
  submitButton: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#7a4f2e",
    color: "#fff",
    cursor: "pointer",
  },
};

// End of file.