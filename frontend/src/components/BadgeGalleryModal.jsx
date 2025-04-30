import React, { useEffect, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';

const BadgeGalleryModal = ({ show, onClose }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      if (!show) return;

      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        // 1. Get earned badge codes from your backend
        const { data: badgeCodes } = await axios.get(
          `http://localhost:5001/api/users/${user.userId}/badges`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (badgeCodes.length === 0) {
          setBadges([]);
          return;
        }

        // 2. Get full country details (incl. flag)
        const { data: countries } = await axios.get(
          `https://restcountries.com/v3.1/alpha?codes=${badgeCodes.join(',')}`
        );

        setBadges(countries);
      } catch (err) {
        console.error('Failed to fetch badges:', err);
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [show]);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          <span role="img" aria-label="medal">🏅</span> My Flags
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : badges.length === 0 ? (
          <p className="text-center text-muted">No flags earned yet. Take quizzes to collect them!</p>
        ) : (
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {badges.map((country) => (
              <div key={country.cca3} className="text-center">
                <img
                  src={country.flags?.svg}
                  alt={country.name.common}
                  className="img-fluid rounded shadow-sm"
                  style={{ width: 60, height: 'auto' }}
                />
                <div className="small text-muted mt-1">{country.name.common}</div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BadgeGalleryModal;