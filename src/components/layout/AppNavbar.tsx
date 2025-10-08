import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './AppNavbar.css'


type Props = {}


const AppNavbar: React.FC<Props> = () => {
    return (
        <header className="app-header">
            <Navbar expand="lg" className="app-navbar" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img src="/img/home.png" alt="Домой" className="brand-img" />
                    </Navbar.Brand>


                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Главная</Nav.Link>
                            <Nav.Link as={Link} to="/reactions">Реакции</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}


export default AppNavbar