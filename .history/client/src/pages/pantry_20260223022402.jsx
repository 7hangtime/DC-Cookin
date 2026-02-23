import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function Pantry() {
  const [user, setUser] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [newIngredient, setNewIngredient] = useState(""); // input state

  useEffect(() => {
    const fetchSessionAndPantry = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const loggedUser = data.session.user; 
        setUser(loggedUser);

        try {
          const res = await fetch(
            `http://localhost:3000/api/pantry?userId=${loggedUser.id}`
          );
          const items = await res.json();
          setPantryItems(items); 
        } catch (err) {
          console.error("Failed to fetch pantry items:", err);
        }
      }
    };

    fetchSessionAndPantry();
  }, []);

  // Add a new ingredient
  const handleAdd = async () => {
    if (!newIngredient.trim() || !user) return;

    try {
      // Send to Supabase
      const res = await fetch("http://localhost:3000/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ingredient_name: newIngredient,
        }),
      });

      if (res.ok) {
        // Use the returned ingredient to update UI immediately
        const added = await res.json();
        setPantryItems((prev) => [...prev, added]); // push the new item to state
        setNewIngredient(""); // reset input
      }
    } catch (err) {
      console.error("Failed to add ingredient:", err);
    }
  };

  // Delete an ingredient
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/pantry/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPantryItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete ingredient:", err);
    }
  };

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      <div
        style={{
          ...styles.container,
          backgroundColor: "#344d9e",
          backgroundImage: "linear-gradient(135deg, #0010f7 0%, #75a6ce 100%)",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <h1 style={{ ...styles.title, color: "#fff" }}>My Pantry</h1>
        <p style={{ color: "#fff" }}>
          {user ? `Logged in as: ${user.email}` : "Not logged in"}
        </p>

        {/* Add Ingredient Section */}
        <div
          style={{
            display: "flex",
            marginTop: "20px",
            marginBottom: "20px",
            width: "80%",
            maxWidth: "800px",
          }}
        >
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="Add new ingredient"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px 0 0 5px",
              border: "1px solid #ccc",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: "10px 20px",
              backgroundColor: "#00ff62",
              border: "none",
              borderRadius: "0 5px 5px 0",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        {/* Pantry Items */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "20px",
            width: "80%",
            maxWidth: "800px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {pantryItems.length > 0 ? (
            <ul>
              {pantryItems.map((item) => (
                <li key={item.id} style={{ marginBottom: "10px" }}>
                  {item.ingredient_name}
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      marginLeft: "10px",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pantry items yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
};