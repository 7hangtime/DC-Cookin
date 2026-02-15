import { Routes, Route } from 'react-router-dom'
import ResultsPage from '../pages/resultspage.jsx'
import Login from "../pages/login.jsx";

export default function AppRoutes () {
  return (
    <Routes>
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/login" element={<Login />} /> 
    </Routes>
  );
}
