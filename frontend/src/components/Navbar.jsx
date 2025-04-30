import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import BadgeGalleryModal from './BadgeGalleryModal';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const [showBadges, setShowBadges] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md" fixed="top">
        <Container>
          <Navbar.Brand href="/">
            <span role="img" aria-label="globe">🌍</span> Country Explorer
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {user ? (
                <>
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="outline-light" id="user-dropdown" size="sm">
                      Hi, {user.username}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setShowBadges(true)}>🏅 My Badges</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Button variant="outline-light" size="sm">Login / Register</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🏅 Badge Modal */}
      <BadgeGalleryModal show={showBadges} onClose={() => setShowBadges(false)} />
    </>
  );
};

export default AppNavbar;