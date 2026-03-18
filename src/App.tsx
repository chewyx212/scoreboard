import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CalculatorPage } from './pages/CalculatorPage';
import { ScoreboardPage } from './pages/ScoreboardPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/team/:teamId" element={<CalculatorPage />} />
        <Route path="/scoreboard" element={<ScoreboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/scoreboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
