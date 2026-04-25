import React, { useState } from "react";
import foodImage from "../assets/food.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabase";

// This is the login page for the application. It's purpose is to allow users to log in to their accounts.
function Login() {
  const [email, setEmail] = useState(""); //We use this to store the email input
  const [password, setPassword] = useState(""); //We use this to store the password input
  const [message, setMessage] = useState(""); //We use this to store the message that will be displayed to the user
  const navigate = useNavigate(); //We use this to navigate to different pages
  const location = useLocation(); //We use this to get the location of the page

// The purpose of this function is to check if the user's session has expired. If it has, it will display a message to the user. If it hasn't, it will allow the user to log in. 
  const sessionExpired = location.state?.sessionExpired === true;

  async function loginUser() {
    const { data, error } = await supabase.auth.signInWithPassword({ //We use this to sign in the user with their email and password
      email,
      password, //We use this to store the password input
    });

    if (error) {
      setMessage(`Login failed: ${error.message}`); // We use this to display the error message to the user
    } else {
      setMessage(`Logged in as: ${data.user.email}`); // We use this to display the success message to the user
      navigate("/pantry");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.leftSide}>
          {/* #94 – Session-expired banner */}
          {sessionExpired && (
            <div style={styles.expiredBanner}>
              ⚠️ Your session has expired. Please log in again.
            </div>
          )}

          <div style={styles.titleContainer}>
            <h2 style={styles.title}>Welcome to DC Cookin</h2>
            <p style={styles.signInText}>
              Sign in with your email and password
            </p>
          </div>

          <div style={styles.formContainer}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button style={styles.button} onClick={loginUser}>
              Login
            </button>

            {message && <p style={styles.message}>{message}</p>}

            <p style={styles.registerText}>
              Don't have an account?{" "}
              <Link to="/register" style={styles.registerLink}>
                Register now
              </Link>
            </p>
          </div>
        </div>

        <div style={styles.imageContainer}>
          <img src={foodImage} alt="Food" style={styles.image} />
        </div>
      </div>
    </div>
  );
}
// This is the styling for the login page. It is used to make the page look nice and user-friendly. 
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
    width: "1000px",
    maxWidth: "1200px",
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
    gap: "0px",
  },
  // #94 – Expired session banner styles
  expiredBanner: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "8px",
    color: "#856404",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "16px",
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
  message: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#555",
    textAlign: "center",
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
  imageContainer: {
    flex: 1,
    minHeight: "100%",
  },
  image: {
    width: "500px",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
};

export default Login;

// End of Program