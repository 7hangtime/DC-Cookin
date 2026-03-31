import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function Pantry() {
  const [user, setUser] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [test, setTest] = useState(false); // state variable to trigger re-render
    const colors= ['#e65353', "#9c9c9c", '#83e67b'] // colors for pantry items background

  useEffect(() => {
    const fetchSessionAndPantry = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const loggedUser = data.session.user; 
        setUser(loggedUser);

       

          try {
          const {data: items, error} = await supabase
              .from('pantry')
              .select("*")
              .eq("user_id", loggedUser.id)
              .order("ingredient_name", { ascending: true });
          if (error) {
              console.error("Failed to fetch your pantry ingredients: ", error);
          } else {
              setPantryItems(items);
          }
          } catch (error) {
          console.error("Failed to fetch pantry items:", error);
          }
      }
    };

    fetchSessionAndPantry();
  }, []);
   {/* deletes pantry item from supabase */}
    const handleDelete = async (ingredientId) => {
        const { error } = await supabase
            .from("pantry")
            .delete()
            .eq("user_id", user.id)
            .eq("ingredient_id", ingredientId);
        if (error) {
            console.error("Failed to delete ingredient: ", error);
        }
        // Update front-end immediately
        setPantryItems(pantryItems.filter(item => item.ingredient_id !== ingredientId));
    };
        
    {/* Loads pantry items pulled from supabase */}
    const loadpantry = () => {
        return pantryItems.map((item) => (
                    // shows preference as number
                    // <li key={item.id}>{item.ingredient_name} - Preference: {item.Preference}</li>
                    
                    // show preference as color instead of number
                    <li 
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center", 
                      justifyContent: "space-between",
                      padding: "4px 4px",
                    }} >
                        <button
                            onClick={() => update_preference(item.id)}
                            style={{
                                backgroundColor: colors[item.Preference + 1],
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #000000",
                                cursor: "pointer" 
                            }}
                            >   
                        {item.ingredient_name} 
                        </button>
                        <button
                            onClick={async () => {
                                handleDelete(item.ingredient_id);
                                
                            }}
                            style={{
                                color: "#ff0000",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                backgroundColor: "#ffffff00",
                                border: "1px solid #ffffff00",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            X
                        </button>
                    </li>

                    
                ))
            
    };

    {/* updates preference of ingredient in pantry */}
    const update_preference = async (itemId) => { 
        const item = pantryItems.find(item => item.id === itemId);
        if (!item) return;
        let cur = item.Preference;
        if(cur == -1){
            item.Preference = 0;
        }
        else if(cur == 0){
            item.Preference = 1;
        }
        else if(cur == 1){
            item.Preference = -1;
        }
        const { data, error } = await supabase
            .from("pantry")
            .update({ Preference: item.Preference })
            .eq("id", itemId)
            .eq("user_id", user.id)    
        setTest(!test); // trigger re-render

        
    }

// Delete an ingredient from Supabase and update front-end
                            // note:
                            //  this fuction is dylans original function for deleting pantry items
                            //  Cole used it as a basis but doesn't know which is better
                            //  replaced it with the handleDelete function above that is called in the onClick of the delete button
  // const handleDelete = async (ingredientId) => {
  //   if (!user) return;

  //   try {
  //     const { error } = await supabase
  //       .from("pantry")
  //       .delete()
  //       .eq("id", ingredientId)
  //       .eq("user_id", user.id);

  //     if (error) {
  //       console.error("Failed to delete ingredient:", error);
  //     } else {
  //       // Remove ingredient from front-end immediately
  //       setPantryItems(pantryItems.filter(item => item.id !== ingredientId));
  //     }
  //   } catch (err) {
  //     console.error("Error deleting ingredient:", err);
  //   }
  // };




    
return (
    <div style={{padding: "40px", position: "relative", minHeight: "100vh"}}>
      <div style={{...styles.container, backgroundImage:"linear-gradient(90deg, #1f6feb, #20b7c7)"}}>
        <div style={styles.header}>
        <h1 style={{...styles.title, color:"#ffffff", position:"relative", top:"10px", left:"-750px"}}>My Pantry</h1>
        <p style={{...styles.subtitle, position:"absolute", top:"50px", right:"60px", color:"#ffffff", fontFamily:"Arial, sans-serif"}}>{user ? <p>Logged in as: {user.email}</p> : <p>Not logged in</p>}</p>
        <button style={{...styles.button, position:"absolute", top:"150px", right:"60px", width:"150px", backgroundColor:"#00ff62", color:"#000000"}} onClick={() => window.location.href = "/pantry-add"}>Add Ingredient</button>
        
           {/* show pantry  */}
        <div style={{
            ...styles.container, 
            backgroundColor:"#ffffff", 
            borderRadius:"15px", 
            padding:"10px", 
            marginTop:"20px", 
            width:"1200px",
            minHeight:"200px", 
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)", 
            position:"relative",
            top: "5px", 
            left:"150px" }}>
            <h1 style={{
                    ...styles.title, 
                    color:"#ee0000", 
                    fontSize:"16px"}}>
                        Your Pantry
                </h1>
              {pantryItems.length > 0 ? (
                
              // this is the styling for the pantry items list, it is a grid with tight groupings and no bullet points 
              <ul  
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                rowGap: "2px",
                columnGap: "0px",
                alignContent: "start",
                padding: "0",
                listStyle: "none",
              }}
              >
                {loadpantry()}
            </ul>
            ) : (
                <p style={{ 
                    position: "absolute",
                    marginTop: "37px", 
                    marginLeft: "1px"
                }}>loading pantry items...</p>

                
            )} 
            </div>
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
