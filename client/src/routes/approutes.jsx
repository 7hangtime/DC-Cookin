import { Routes, Route } from 'react-router-dom'
import ResultsPage from '../pages/resultspage.jsx'
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import Pantry from "../pages/pantry.jsx";
import PantryAdd from "../pages/pantryadd.jsx";
<<<<<<< HEAD
import RecipeDetails from "../pages/recipedetails.jsx";
=======
>>>>>>> 862bb52af9ae40120c19594fba514ee2cd5780d8

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pantry" element={<Pantry />} />
      <Route path="/pantry-add" element={<PantryAdd />} />
<<<<<<< HEAD
      <Route path="/recipe/:id" element={<RecipeDetails />} />
=======
>>>>>>> 862bb52af9ae40120c19594fba514ee2cd5780d8
    </Routes>
  );
}