import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  selectIsAuthenticated,
  selectUser,
  logoutUser,
} from "../../slices/authSlice";
import "./AppNavbar.css";

const AppNavbar: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
  };

  return (
    <header className="app-header">
      <Navbar className="app-navbar" variant="dark">
        <div className="navbar-content">
          <div className="brand-wrap">
            <Link to="/" className="brand-link">
              <img
                src={`${import.meta.env.BASE_URL}/img/home.png`}
                alt="Домой"
                className="brand-img"
              />
            </Link>
          </div>

          <Nav className="nav-links-desktop">
            <Nav.Link as={Link} to="/reactions" className="nav-link-text">
              Реакции
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/calculations"
                  className="nav-link-text"
                >
                  Мои расчеты
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="nav-link-text">
                  {user?.login || "Профиль"}
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="nav-link-text">
                  Выход
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  state={{ from: location }}
                  className="nav-link-text"
                >
                  Вход
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  state={{ from: location }}
                  className="nav-link-text"
                >
                  Регистрация
                </Nav.Link>
              </>
            )}
          </Nav>

          <div className="nav-mobile">
            <div
              className={`burger-icon ${isMenuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>

            {isMenuOpen && (
              <div className="mobile-menu">
                <Nav.Link
                  as={Link}
                  to="/reactions"
                  className="nav-link-text-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  Реакции
                </Nav.Link>
                {isAuthenticated ? (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/calculations"
                      className="nav-link-text-mobile"
                      onClick={() => setMenuOpen(false)}
                    >
                      Мои расчеты
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/profile"
                      className="nav-link-text-mobile"
                      onClick={() => setMenuOpen(false)}
                    >
                      {user?.login || "Профиль"}
                    </Nav.Link>
                    <Nav.Link
                      onClick={handleLogout}
                      className="nav-link-text-mobile"
                    >
                      Выход
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/login"
                      state={{ from: location }}
                      className="nav-link-text-mobile"
                      onClick={() => setMenuOpen(false)}
                    >
                      Вход
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/register"
                      state={{ from: location }}
                      className="nav-link-text-mobile"
                      onClick={() => setMenuOpen(false)}
                    >
                      Регистрация
                    </Nav.Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Navbar>
    </header>
  );
};

export default AppNavbar;
