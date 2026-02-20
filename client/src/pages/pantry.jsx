import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function Pantry() {
  const [user, setUser] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);

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

  return (
    <div style={{ padding: "40px" }}>
      <h2>Pantry Page (Auth Test)</h2>

      {user ? <p>Logged in as: {user.email}</p> : <p>Not logged in</p>}

      <h3>My Pantry Items:</h3>
      {pantryItems.length > 0 ? (
        <ul>
          {pantryItems.map((item) => (
            <li key={item.id}>{item.ingredient_name}</li>
          ))}
        </ul>
      ) : (
        <p>No pantry items yet.</p>
      )}
    </div>
  );
}
