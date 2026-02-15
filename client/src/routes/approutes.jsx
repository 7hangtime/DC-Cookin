import { Routes, Route } from 'react-router-dom'
import ResultsPage from '../pages/resultspage.jsx'
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";

export default function AppRoutes () {
  return (
    <Routes>
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
