// The code below is a React component that defines the routes for a web application. It uses the `Routes` and `Route` components from the `react-router-dom` library to define the different pages of the application. The `RequireAuth` and `Redirect
import { Routes, Route } from 'react-router-dom'
import ResultsPage from '../pages/resultspage.jsx'
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import Pantry from "../pages/pantry.jsx";
import PantryAdd from "../pages/pantryadd.jsx";
import RecipeDetails from "../pages/recipedetails.jsx";
import AllRecipesPage from '../pages/allrecipes.jsx';
import RequireAuth from "../components/RequireAuth.jsx";
import RedirectIfAuth from "../components/RedirectIfAuth.jsx";
import StoresList from "../pages/storeslist";
import StoreInventory from "../pages/storeinventory.jsx"



// This part of the code will be used to define the routes for the web application. The `Routes` component is used to wrap all the `Route` components. The `Route` component is used to define a single route. The `path` prop is used to define the path of the route. The `element` prop is
export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuth>
            <Register />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/results"
        element={
          <RequireAuth>
            <ResultsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/pantry"
        element={
          <RequireAuth>
            <Pantry />
          </RequireAuth>
        }
      />
      <Route
        path="/pantry-add"
        element={
          <RequireAuth>
            <PantryAdd />
          </RequireAuth>
        }
      />
      <Route
        path="/recipe/:id"
        element={
          <RequireAuth>
            <RecipeDetails />
          </RequireAuth>
        }
      />
      <Route
        path="/recipes"
        element={
          <RequireAuth>
            <AllRecipesPage />
          </RequireAuth>
        }
      />

      <Route
        path="/stores"
        element={
          <RequireAuth>
            <StoresList />
          </RequireAuth>
        }
      />

      <Route
        path="/stores/:id"
        element={
          <RequireAuth>
            <StoreInventory />
          </RequireAuth>
        }
      />
    </Routes>
  );
}