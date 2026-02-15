import React, { useState } from "react";
import foodImage from "../assets/food.jpg";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function loginUser() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Login data:", data);
    console.log("Login error:", error);

    if (error) {
      setMessage(`Login failed: ${error.message}`);
    } else {
      setMessage(`Logged in as: ${data.user.email}`);

    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.leftSide}>
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
