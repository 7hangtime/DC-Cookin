import { Routes, Route } from 'react-router-dom'
import ResultsPage from '../pages/resultspage.jsx'

export default function AppRoutes () {
  return (
    <Routes>
      <Route path='/results' element={<ResultsPage />} />
    </Routes>
  )
}
