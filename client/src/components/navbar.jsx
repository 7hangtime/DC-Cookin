import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import logo from "../assets/logo.png";
import "./navbar.css";

// The purpose of this component is to display the navigation bar at the top of the page. It includes links to different pages of the application and a logout button if the user is logged in.
export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // This useEffect hook is used to check if the user is logged in. If the user is logged in, the user object is stored in the state. If the user is not logged in, the user object is set to null.
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // This useEffect hook is used to listen for changes in the user's authentication state. If the user logs in or out, the user object is updated in the state.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    // This function is used to log the user out of the application. It uses the supabase.auth.signOut() method to sign the user out. If there is an error, it is logged to the console. The user is then redirected to the login page.
    const { error } = await supabase.auth.signOut({ scope: "global" });

    if (error) {
      console.error("Logout error:", error.message);
    }


    navigate("/login");
  }
  // This is the JSX that is returned by the component. It includes the navigation bar with links to different pages of the application and a logout button if the user is logged in.
  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/pantry" className="nav-brand">
          <img className="nav-logo" src={logo} alt="D.C. Cookin" />
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/pantry"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Pantry
          </NavLink>
          <NavLink
            to="/pantry-add"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Add Ingredients
          </NavLink>
          <NavLink
            to="/results"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            My Recipes
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            All Recipes
          </NavLink>
          <NavLink
            to="/recipe-add"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Submit a Recipe
          </NavLink>
          <NavLink
            to="/stores"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Stores
          </NavLink>

          <NavLink
            to="/saved-recipes"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Saved Recipes
          </NavLink>
        </nav>

        <div className="nav-actions">
          <NavLink to="/login" className="nav-button ghost">
            Login
          </NavLink>

          {!user ? (
            <NavLink to="/register" className="nav-button solid">
              Sign Up
            </NavLink>
          ) : (
            <button onClick={handleLogout} className="nav-button solid">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
// End of Program