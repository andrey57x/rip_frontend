import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AppNavbar.css";

const AppNavbar: React.FC = () => {
  // Состояние для контроля открытия/закрытия меню
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <Navbar className="app-navbar" variant="dark">
        <div className="navbar-content">
          <div className="brand-wrap">
            <Link to="/" className="brand-link">
              <img
                src={`${import.meta.env.BASE_URL}img/home.png`}
                alt="Домой"
                className="brand-img"
              />
            </Link>
          </div>

          {/* Обычные ссылки для десктопа */}
          <Nav className="nav-links-desktop">
            <Nav.Link as={Link} to="/reactions" className="nav-link-text">
              Реакции
            </Nav.Link>
          </Nav>

          {/* Иконка бургера и мобильное меню */}
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
                {/* <Nav.Link
                  as={Link}
                  to="/"
                  className="nav-link-text-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  Главная
                </Nav.Link> */}
                <Nav.Link
                  as={Link}
                  to="/reactions"
                  className="nav-link-text-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  Реакции
                </Nav.Link>
              </div>
            )}
          </div>
        </div>
      </Navbar>
    </header>
  );
};

export default AppNavbar;
