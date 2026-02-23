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
            `http://localhost:3001/api/pantry?userId=${loggedUser.id}`
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
      const res = await fetch("http://localhost:3001/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ingredient_name: newIngredient,
        }),
      });
      if (res.ok) {
        setNewIngredient("");
        // Refresh the pantry after adding
        const updated = await fetch(
          `http://localhost:3001/api/pantry?userId=${user.id}`
        );
        const items = await updated.json();
        setPantryItems(items);
      }
    } catch (err) {
      console.error("Failed to add ingredient:", err);
    }
  };

  // Delete an ingredient
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/pantry/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // Refresh the pantry after deletion
        const updated = await fetch(
          `http://localhost:3001/api/pantry?userId=${user.id}`
        );
        const items = await updated.json();
        setPantryItems(items);
      }
    } catch (err) {
      console.error("Failed to delete ingredient:", err);
    }
  };

  return (
    <div style={{ padding: "40px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <h1>My Pantry</h1>
      <p>{user ? `Logged in as: ${user.email}` : "Not logged in"}</p>

      {/* Add Ingredient Section */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder="New ingredient"
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button onClick={handleAdd} style={{ padding: "8px" }}>
          Add
        </button>
      </div>

      {/* Pantry List */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px" }}>
        {pantryItems.length > 0 ? (
          <ul>
            {pantryItems.map((item) => (
              <li key={item.id} style={{ marginBottom: "8px" }}>
                {item.ingredient_name}{" "}
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "10px" }}>
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
  );
}

    
return (
    <div style={{padding: "40px", position: "relative", minHeight: "100vh"}}>
      <div style={{...styles.container, backgroundColor:"#344d9e", backgroundImage:"linear-gradient(135deg, #0010f7 0%, #75a6ce 100%)"}}>
        <div style={styles.header}>
        <h1 style={{...styles.title, color:"#ffffff", position:"relative", top:"10px", left:"-750px"}}>My Pantry</h1>
        <p style={{...styles.subtitle, position:"absolute", top:"50px", right:"60px", color:"#ffffff", fontFamily:"Arial, sans-serif"}}>{user ? <p>Logged in as: {user.email}</p> : <p>Not logged in</p>}</p>
        <button style={{...styles.button, position:"absolute", top:"150px", right:"60px", width:"150px", backgroundColor:"#00ff62", color:"#000000"}} onClick={() => window.location.href = "/pantry-add"}>Add Ingredient</button>
        {/* add ingredient section */}
        <p style={styles.header} >  
          <p style={{...styles.container, backgroundColor:"#cac7c7e0", borderRadius:"15px", padding:"10px", width:"1000px",height:"8px", position:"relative", left:"150px" }}>
            <h1 style={{...styles.title, color:"#ee0000", fontSize:"10px"}}>temp add ingredient section'</h1>
          </p>
        </p>
        {/* show ingredient(s) section */}
        <p style={{...styles.container, backgroundColor:"#ffffff", borderRadius:"15px", padding:"20px", marginTop:"20px", width:"2000px",height:"600px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", position:"relative", left:"150px" }}>
            {pantryItems.length > 0 ? (
            <ul>
              {pantryItems.map((item) => (
                <li key={item.id}>{item.ingredient_name}</li>
              ))}
            </ul>
            ) : (
              <p>No pantry items yet.              </p>
            )}
            </p>
      </div>  
      </div>
      
       
       {/*  Original page */}
{/* return(
  <div style={styles.container}>         
    <div style={styles.leftSide}>
      <div style={styles.titleContainer}>
        <h2 style={styles.title}>Pantry</h2>
        <p style={styles.signInText}>Your personal pantry items</p>

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
    </div>
  </div> */}

      
    </div>
  );

}


const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    display: "flex",
    height: "70vh",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
    width: "500px",
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    boxSizing: "border-box",
  },
  titleContainer: {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    color: "#000",
    marginBottom: "1px",
  },
  signInText: {
    fontSize: "13px",
    color: "#000",
  },
  formContainer: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    fontSize: "16px",
    backgroundColor: "white",
    borderRadius: "15px",
    border: "1px solid #ccc",
    color: "#000",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    fontSize: "16px",
    borderRadius: "15px",
    border: "none",
    backgroundColor: "black",
    color: "white",
    cursor: "pointer",
  },
  registerText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#555",
    textAlign: "center",
  },
  registerLink: {
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline",
  },
};