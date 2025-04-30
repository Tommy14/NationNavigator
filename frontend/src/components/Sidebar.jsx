import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './../index.css'; // optional for extra styling

const Sidebar = () => {
    return (
      <div className="sidebar bg-dark text-white p-3">
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/" className="text-white">
            🏠 Home
          </Nav.Link>
          <Nav.Link as={Link} to="/my-badges" className="text-white">
            🏅 My Badges
          </Nav.Link>
          <Nav.Link as={Link} to="/quiz-history" className="text-white">
            🧠 Quiz History
          </Nav.Link>
          <Nav.Link as={Link} to="/about" className="text-white">
            ℹ️ About
          </Nav.Link>
        </Nav>
      </div>
    );
  };
  
  export default Sidebar;