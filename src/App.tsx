import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppNavbar from "./components/layout/AppNavbar";
import HomePage from "./pages/HomePage";
import ReactionsPage from "./pages/ReactionsPage";
import ReactionDetailPage from "./pages/ReactionDetailPage";
import "./App.css";
import { ROUTER_BASENAME } from "./config/sharedConfig";

const App: React.FC = () => {
  return (
    <Router basename={ROUTER_BASENAME}>
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
