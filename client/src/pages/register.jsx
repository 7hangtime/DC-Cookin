import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.leftSide}>
          <div style={styles.titleContainer}>
            <h2 style={styles.title}>Sign Up</h2>
            <p style={styles.signInText}>Create your account to get started</p>
          </div>

          <div style={styles.formContainer}>
            <input type="email" placeholder="Email" style={styles.input} />
            <input
              type="password"
              placeholder="Password"
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              style={styles.input}
            />
            <button style={styles.button}>Sign Up</button>
            <p style={styles.registerText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.registerLink}>
                Login
              </Link>
            </p>
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

export default Register;
