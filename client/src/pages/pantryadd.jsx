import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function PantryAdd() {
    const [user, setUser] = useState(null);
    const [pantryItems, setPantryItems] = useState([]);
    {/* Creates list to hold ingredients from supabase */}
    const [ingredientsList, setIngredientsList] = useState([]);
    {/* Creates object to hold search term */}
    const [searchTerm, setSearchTerm] = useState("");
    {/* Creates list to hold ingredients ready to be added */}
    const [holdingList, setHoldingList] = useState([]);
    
    {/* Preference creation function, cycles through prefer, avoid, and neutral */ }
    const [test, setTest] = useState(false); // state variable to trigger re-render
    const [prefer, setPrefer] = useState(false);
    const [avoid, setAvoid] = useState(false); 

    function cycle_preference(type){
        if (type === "prefer") {
            setPrefer(!prefer);
                // backgroundColor = '#83e67b'
            
        } else if (type === "avoid") {
            setAvoid(!avoid);
            // backgroundColor prefer = '#e65353';
        }else {
            setPrefer(false);
            setAvoid(false);
        }
    };

    function create_preference(prefer, avoid){
        if (prefer == 1 && avoid == 0)
            return 1;
        else if (avoid == 1 && prefer == 0)
            return -1;
        else
            return 0;
    };
    
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

        try {
            {/* Fetches ingredients from supabase */}
            const {data: ingredients, error} = await supabase
                .from('ingredients')
                .select("*")
                .order("ingredient_name", { ascending: true });

            {/* Prints error if failed, else put ingredients into list */}
            if (error) {
                console.error("Failed to fetch ingredients: ", error);
            } else {
                setIngredientsList(ingredients);
            }
        } catch(error) {
            console.error("Failed to fetch ingredients: ", error);
        }
        };

        fetchSessionAndPantry();
    }, []);

    
    {/* Adds ingredients to holding list*/}
    const addHoldingList = (ingredient) => {
        if (!ingredient) return;

        {/* Checks to see if ingredient is already in holding list */}
        const exists = holdingList.find(item => item.id === ingredient.id);
        {/* If it exists, it removes it, else, it adds it */}
        if (exists) {
            setHoldingList(holdingList.filter(item => item.id !== ingredient.id));
        } else {
            setHoldingList([...holdingList, ingredient]);
        }

    };

    {/* Adds ingredients in holding list to user's pantry */}
    const handleAddIngredient = async () => {
        if (!user || holdingList.length === 0) return;

        {/* Waits for supabase response then adds ingredients from holding list */}
       const { data, error } = await supabase
         .from("pantry")
         .upsert(
           holdingList.map((ingredient) => ({
             user_id: user.id,
             ingredient_id: ingredient.id,
             ingredient_name: ingredient.ingredient_name,
             Preference: create_preference(prefer, avoid),
           })),
           { onConflict: ["user_id", "ingredient_id"] }
         )
         .select();
        
        {/* Catches errors, if no errors, updates pantry on page */}
        if (error) console.error(error);
        else setPantryItems([...pantryItems, ...data]);

        {/* Resets holding list */}
        setHoldingList([]);
        cycle_preference("reset");

    };

    {/* Filters ingredients based on search term */}
    const filteredIngredients = ingredientsList.filter((ingredient) =>
        ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    {/* Loads ingredients pulled from supabase and allows them to be highlighted when clicked */}
    const loadIngredients = () => {
        return filteredIngredients.map((ingredient) => {
            const isSelected = holdingList.some(item => item.id === ingredient.id);
            return (
                <button
                    key={ingredient.id}
                    onClick={() => addHoldingList(ingredient)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #000000",
                        backgroundColor: isSelected? "#06402B":"#f0f0f0",
                        cursor: "pointer"
                    }}
                >
                    {ingredient.ingredient_name}
                </button>
            );
        });
    };
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

return (
    <div style={{
        padding: "40px", 
        position: "relative", 
        minHeight: "100vh"
        }}>
        <div style={{
            ...styles.container, 
            // backgroundColor:"#344d9e", 
            backgroundImage:"linear-gradient(90deg, #1f6feb, #20b7c7)"
            }}>
        <div style={styles.header}>
        <h1 style={{
            ...styles.title, 
            color:"#ffffff", 
            position:"relative", 
            top:"10px", 
            left:"-350px"}}>
                My Pantry
        </h1>
        <p style={{
            ...styles.subtitle, 
            position:"absolute", 
            top:"50px", 
            right:"60px", 
            color:"#ffffff", 
            fontFamily:"Arial, sans-serif"}}>
                {user ? <p>Logged in as: {user.email}</p> : <p>Not logged in</p>}</p>
        {/* add ingredient section */}
        <div style={styles.header} >  
            <div style={{
                ...styles.container, 
                backgroundColor:"#cac7c7e0", 
                borderRadius:"15px", 
                padding:"10px", 
                width:"1200px",
                height:"250px", 
                position:"relative", 
                top: "20px",
                left:"150px" }}>
                <h1 style={{
                    ...styles.title, 
                    color:"#ee0000", 
                    fontSize:"16px"}}>
                        Add Ingredients
                </h1>

                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Enter an ingredient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        position: "absolute",
                        marginTop: "5px",
                        marginLeft: "120px",
                        padding: "10px 390px",
                        borderRadius: "8px",
                        border: "1px solid #000000",
                        marginBottom: "510px"
                    }}
                />

                {/* prefer button */}
                <h1 style={{color:"black", position: "absolute", marginTop: "2px", marginLeft: "1082px", padding: "1px 1px", borderRadius: "8px", fontSize:"12px"}}>Prefer</h1>
                <button

                    onClick={() => cycle_preference("prefer")}
                    style={{
                        position: "absolute",
                        marginTop: "17px",
                        marginLeft: "1090px",
                        padding: "10px 10px",
                        borderRadius: "8px",
                        border: "1px solid #000000",
                        backgroundColor: prefer ? "#83e67b":"#ffffff",
                        cursor: "pointer"
                    }}
                >
                    
                </button>
                

                {/* avoid button */}
                <h1 style={{color:"black", position: "absolute", marginTop: "2px", marginLeft: "1125px", padding: "1px 1px", borderRadius: "8px", fontSize:"12px"}}>Avoid</h1>
                <button 
                    type="avoid"
                    onClick={() => cycle_preference("avoid")}
                    style={{
                        text: "Avoid",
                        color: "black",
                        position: "absolute",
                        marginTop: "17px",
                        marginLeft: "1130px",
                        padding: "10px 10px",
                        borderRadius: "8px",
                        border: "1px solid #000000",
                        backgroundColor:avoid ?  "#e65353":"#ffffff",
                        cursor: "pointer"
                    }}
                >
                </button>


                {/* Add button */}
                <button
                    onClick={() => handleAddIngredient()}
                    style={{
                        position: "absolute",
                        marginTop: "5px",
                        marginLeft: "1160px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #000000",
                        backgroundColor: "#f0f0f0",
                        cursor: "pointer"
                    }}
                >
                    +
                </button>

                {/* Ingredient list */}
                {filteredIngredients.length > 0 ? (
                    <ul style={{
                        position: "absolute",
                        marginTop: "60px",
                        marginLeft: "10px"
                    }}>
                        {loadIngredients()};
                    </ul>
                ) : (
                    <p style={{ 
                        position: "absolute",
                        marginTop: "60px", 
                        marginLeft: "10px" 
                    }}>Loading ingredients...</p>
                )}
            </div>
        </div>
        {/* show ingredient(s) section  (pantry already added)*/}
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
            <ul
            // this is the styling for the pantry items list, it is a grid with tight groupings and no bullet points  
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                rowGap: "2px",
                columnGap: "0px",
                alignContent: "start",
                padding: "0",
                listStyle: "none",
              }}>
                {loadpantry()}
            </ul>
            ) : (
                <p style={{ 
                    position: "absolute",
                    marginTop: "37px", 
                    marginLeft: "1px"
                }}>No pantry items yet.</p>
            )}
            </div>
        </div>  
        </div>
    </div>
);
                   
}


const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
    },
    container: {
        display: "flex",
        minHeight: "70vh",
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