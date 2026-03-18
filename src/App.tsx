import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CalculatorPage } from './pages/CalculatorPage';
import { ScoreboardPage } from './pages/ScoreboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/team/:teamId" element={<CalculatorPage />} />
        <Route path="/scoreboard" element={<ScoreboardPage />} />
        <Route path="*" element={<Navigate to="/scoreboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
