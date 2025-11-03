import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import type { AppDispatch } from "./store/store";
import { selectIsAuthenticated } from "./slices/authSlice";
import { fetchDraftInfo } from "./slices/calculationSlice";
import AppNavbar from "./components/layout/AppNavbar";
import HomePage from "./pages/HomePage";
import ReactionsPage from "./pages/ReactionsPage";
import ReactionDetailPage from "./pages/ReactionDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CalculationDetailPage from "./pages/CalculationDetailPage";
import CalculationsListPage from "./pages/CalculationsListPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/auth/PrivateRoute";
import "./App.css";
import { ROUTER_BASENAME } from "./config/sharedConfig";

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDraftInfo());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router basename={ROUTER_BASENAME}>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/draft"
          element={
            <PrivateRoute>
              <CalculationDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/calculations"
          element={
            <PrivateRoute>
              <CalculationsListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/calculations/:id"
          element={
            <PrivateRoute>
              <CalculationDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="/reactions" element={<ReactionsPage />} />
        <Route path="/reactions/:id" element={<ReactionDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
