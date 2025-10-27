import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  selectUser,
  selectAuthStatus,
  selectAuthError,
  updateUserProfile,
  clearAuthError,
  fetchUserProfile,
  logoutUser,
} from "../slices/authSlice";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import "./ProfilePage.css";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setLogin(user.login); // Устанавливаем текущий логин в поле ввода
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError("");
    setSuccessMessage("");
    dispatch(clearAuthError());

    if (!user) return;

    let loginChanged = false;
    const payload: { login?: string; password?: string } = {};

    if (login && login !== user.login) {
      payload.login = login;
      loginChanged = true;
    }

    if (password) {
      if (password !== confirmPassword) {
        setClientError("Пароли не совпадают");
        return;
      }
      if (password.length < 4) {
        setClientError("Пароль должен быть длиннее 3 символов");
        return;
      }
      payload.password = password;
    }

    if (Object.keys(payload).length === 0) {
      setClientError("Нет изменений для сохранения");
      return;
    }

    const result = await dispatch(
      updateUserProfile({ id: user.id, data: payload })
    );

    if (updateUserProfile.fulfilled.match(result)) {
      setSuccessMessage("Профиль успешно обновлен!");
      setPassword("");
      setConfirmPassword("");

      if (loginChanged) {
        setSuccessMessage(
          "Профиль успешно обновлен! Так как вы сменили логин, необходимо войти заново."
        );
        setTimeout(() => {
          dispatch(logoutUser());
          navigate("/login");
        }, 3000);
      }
    }
  };

  if (!user) {
    return (
      <main className="profile-page">
        <div className="loading-spinner">Загрузка данных пользователя...</div>
      </main>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[{ title: "Главная", to: "/" }, { title: "Личный кабинет" }]}
      />
      <main className="profile-page">
        <h1 className="profile-title">Личный кабинет</h1>

        <form onSubmit={handleSubmit} className="profile-form">
          <h2 className="auth-form-title" style={{ fontSize: "1.5rem" }}>
            Редактирование профиля
          </h2>

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
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="new-password">
              Новый пароль (оставьте пустым, чтобы не менять)
            </label>
            <input
              id="new-password"
              type="password"
              className="auth-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите новый пароль"
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="confirm-password">
              Подтвердите пароль
            </label>
            <input
              id="confirm-password"
              type="password"
              className="auth-form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите новый пароль"
            />
          </div>
          <button
            type="submit"
            className="auth-form-button"
            disabled={authStatus === "loading"}
          >
            {authStatus === "loading" ? "Сохранение..." : "Сохранить изменения"}
          </button>
          {clientError && (
            <p className="feedback-message feedback-error">{clientError}</p>
          )}
          {authError && (
            <p className="feedback-message feedback-error">{authError}</p>
          )}
          {successMessage && (
            <p className="feedback-message feedback-success">
              {successMessage}
            </p>
          )}
        </form>
      </main>
    </>
  );
};

export default ProfilePage;
