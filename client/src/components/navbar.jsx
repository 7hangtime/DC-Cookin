import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "./navbar.css";

export default function Navbar() {
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
                    <NavLink to="/results" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        My Recipies
                    </NavLink>
                    <NavLink to="/pantry-add" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Add Ingredients
                    </NavLink>
                </nav>

                <div className="nav-actions">
                    <NavLink to="/login" className="nav-button ghost">Login</NavLink>
                    <NavLink to="/register" className="nav-button solid">Sign Up</NavLink>
                </div>
            </div>
        </header>
    );
}