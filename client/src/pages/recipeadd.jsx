import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { addRecipe } from "../api/addrecipeApi";

export default function RecipeAdd() {
    const[user, setUser] = useState(null);
    const[errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                const loggedUser = data.session.user;
                setUser(loggedUser);
            }
        };

        fetchSession();
    }, []);

    const validateForm = (data) => {
        const errors = {};

        if (!data.recipename || data.recipename.trim() === "") {
        errors.recipename = "Recipe name is required";
        }

        if (!data.ingredients || data.ingredients.trim() === "") {
            errors.ingredients = "Ingredients are required";
        }

        return errors;
    };

    const formSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const recipeData = {
            recipename: formData.get("recipename"),
            ingredients: formData.get("ingredients"),
            measurements: formData.get("measurements"),
            instructions: formData.get("instructions"),
            image: formData.get("image")
        };

        const formErrors = validateForm(recipeData);

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            await addRecipe(recipeData);
            e.target.reset();
        } catch (err) {
            alert("Error: " + err.message);
        }
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
            backgroundImage:"linear-gradient(90deg, #1f6feb, #20b7c7)"
        }}>
            <h1 style={{
            ...styles.title, 
            color:"#fffffff3", 
            position:"relative", 
            top:"10px",
            left: "20px"}}>
                Add A Recipe
            </h1>

            <div style={{
                ...styles.container, 
                backgroundColor:"#cac7c7e0", 
                borderRadius:"15px", 
                padding:"10px", 
                width:"1050px",
                height:"250px", 
                position:"relative", 
                top: "20px",
                left:"60px"
            }}>
                <form id="recipeForm" onSubmit={formSubmit} style={{
                position:"relative"
                }}>
                    <label for="recipename" style={{
                        ...styles.label
                    }}>Recipe Name:</label><br></br>
                    <input type="text" id="recipename" name="recipename" style={{
                        ...styles.textinput,
                        width:"1000px",
                        height:"20px"
                        }}></input><br></br>

                    <label for="ingredients" style={{
                        ...styles.label
                    }}>Ingredients:</label><br></br>
                    <input type="text" id="ingredients" name="ingredients" style={{
                        ...styles.textinput,
                        width:"1000px",
                        height:"20px"
                        }}></input><br></br>

                    <label for="measurements" style={{
                        ...styles.label
                    }}>Ingredient Measurements:</label><br></br>
                    <textarea id="measurements" name="measurements" style={{
                        ...styles.textinput,
                        overflow:"hidden",
                        resize: "none",
                        width:"1000px",
                        height:"125px"
                    }}></textarea><br></br>
                    
                    <label for="instructions" style={{
                        ...styles.label
                    }}>Recipe Instructions:</label><br></br>
                    <textarea id="instructions" name="instructions" style={{
                        ...styles.textinput,
                        overflow:"hidden",
                        resize: "none",
                        width:"1000px",
                        height:"175px"
                    }}></textarea><br></br>

                    <label for="image" style={{
                        ...styles.label
                    }}>Image URL:</label><br></br>
                    <input type="text" id="image" name="image" style={{
                        ...styles.textinput,
                        width:"1000px",
                        height:"20px"
                    }}></input><br></br><br></br>

                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        </div>
        
    </div>
);

};

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
    title: {
        textAlign: "center",
        fontSize: "28px",
        color: "#000",
        marginBottom: "1px",
    },
    label: {
        color: "#000000"
    },
    textinput: {
        borderRadius: "5px",
    },
};