import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function PantryAdd() {
    const [user, setUser] = useState(null);
    const [pantryItems, setPantryItems] = useState([]);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [holdingList, setHoldingList] = useState([]);

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

        try {
            const {data: ingredients, error} = await supabase
                .from('ingredients')
                .select("*")
                .order("ingredient_name", { ascending: true });
        } catch(err) {
            console.error("Failed to fetch ingredients: ", err);
        }
        };

        fetchSessionAndPantry();
    }, []);

    const addHoldingList = (ingredient) => {
        if (!ingredient) return;

        const exists = holdingList.find(item => item.id === ingredient.id);
        if (exists) {
            setHoldingList(holdingList.filter(item => item.id !== ingredient.id));
        } else {
            setHoldingList([...holdingList, ingredient]);
        }

        setHoldingList([...holdingList, ingredient]);
    };

    const handleAddIngredient = () => {
        if (!user) return;

        const newPantryItems = holdingList.map(ingredient => ({
            id: 0, 
            user_id: loggedUser.id, 
            ingredient_id: ingredient.id, 
            ingredient_name: ingredient.ingredient_name,
            Preference: 0
        }));

        setPantryItems([...pantryItems, ...newPantryItems]);

        setHoldingList([]);

    };

    const filteredIngredients = ingredientsList.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

return (
    <div style={{
        padding: "40px", 
        position: "relative", 
        minHeight: "100vh"
        }}>
        <div style={{
            ...styles.container, 
            backgroundColor:"#344d9e", 
            backgroundImage:"linear-gradient(135deg, #0010f7 0%, #75a6ce 100%)"
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

                <input
                    type="text"
                    placeholder="Enter an ingredient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        position: "absolute",
                        marginTop: "5px",
                        marginLeft: "120px",
                        padding: "10px 430px",
                        borderRadius: "8px",
                        border: "1px solid #000000",
                        marginBottom: "510px"
                    }}
                />

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

                {filteredIngredients.length > 0 ? (
                    <ul>
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
        {/* show ingredient(s) section */}
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
            <ul>
                {pantryItems.map((item) => (
                    <li key={item.id}>{item.ingredient_name}</li>
                ))}
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