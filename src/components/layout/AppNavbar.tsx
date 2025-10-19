import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AppNavbar.css";

const AppNavbar: React.FC = () => {
  return (
    <header className="app-header">
      <Navbar className="app-navbar" variant="dark">
        {/* Вся ширина: логотип слева, ссылки справа */}
        <div className="navbar-content">
          <div className="brand-wrap">
            <Link to="/" className="brand-link">
              <img src={`${import.meta.env.BASE_URL}img/home.png`} alt="Домой" className="brand-img" />
            </Link>
          </div>

          <Nav className="nav-links">
            {/* <Nav.Link as={Link} to="/" className="nav-link-text">
              Главная
            </Nav.Link> */}
            <Nav.Link as={Link} to="/reactions" className="nav-link-text">
              Реакции
            </Nav.Link>
          </Nav>
        </div>
      </Navbar>
    </header>
  );
};

export default AppNavbar;
