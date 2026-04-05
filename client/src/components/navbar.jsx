import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import logo from "../assets/logo.png";
import "./navbar.css";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // get current user
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        // listen for login/logout changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate("/login");
    }

    return (
        <header className="nav">
            <div className="nav-inner">
                <NavLink to="/pantry" className="nav-brand">
                    <img className="nav-logo" src={logo} alt="D.C. Cookin" />
                </NavLink>

                <nav className="nav-links">
                    <NavLink to="/pantry" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Pantry
                    </NavLink>
                    <NavLink to="/pantry-add" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Add Ingredients
                    </NavLink>
                    <NavLink to="/results" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        My Recipes
                    </NavLink>
                    <NavLink to="/recipes" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        All Recipes
                    </NavLink>
                    <NavLink to="/recipe-add" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>
                        Submit a Recipe
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