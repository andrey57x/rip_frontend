import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppNavbar from "./components/layout/AppNavbar";
import HomePage from "./pages/HomePage";
import ReactionsPage from "./pages/ReactionsPage";
import ReactionDetailPage from "./pages/ReactionDetailPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reactions" element={<ReactionsPage />} />
        <Route path="/reactions/:id" element={<ReactionDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
