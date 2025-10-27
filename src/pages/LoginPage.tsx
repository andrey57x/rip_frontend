import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch } from "../store/store";
import {
  loginUser,
  selectAuthStatus,
  selectIsAuthenticated,
  selectAuthError,
  clearAuthError,
} from "../slices/authSlice";
import "./AuthForm.css";

const LoginPage: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const authStatus = useSelector(selectAuthStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authError = useSelector(selectAuthError);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }

    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch, from]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ login, password }));
  };

  return (
    <main className="auth-page">
      <div className="auth-form-container">
        <h1 className="auth-form-title">Вход в систему</h1>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="login">
              Логин
            </label>
            <input
              id="login"
              type="text"
              className="auth-form-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className="auth-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="auth-form-button"
            disabled={authStatus === "loading"}
          >
            {authStatus === "loading" ? "Вход..." : "Войти"}
          </button>
          {authStatus === "failed" && authError && (
            <p className="auth-form-error">{authError}</p>
          )}
        </form>
        <Link
          to="/register"
          state={{ from: location.state?.from }}
          className="auth-form-link"
        >
          Нет аккаунта? Зарегистрироваться
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;
