import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import AuthDropdown from './AuthDropdown';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md" fixed="top">
        <Container>
          <Navbar.Brand href="/">
            <span role="img" aria-label="globe">🌐</span> Country Explorer
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav>
              {user ? (
                <>
                  <Navbar.Text className="me-3">Hi, {user.username}</Navbar.Text>
                  <Button onClick={logout} variant="outline-light" size="sm">Logout</Button>
                </>
              ) : (
                <Button onClick={() => setShowAuth(true)} variant="outline-light" size="sm">Login / Register</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthDropdown show={showAuth} handleClose={() => setShowAuth(false)} />
    </>
  );
};

export default AppNavbar;