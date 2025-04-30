import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import Navbar from '../components/Navbar';
import { getCountryByName } from '../services/countryService';
import { Modal, Button } from 'react-bootstrap';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// 🎨 Generate a consistent color based on country name
const getColor = (name) => {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 80%)`;
};

const HomePage = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCountryClick = async (geo) => {
    const name = geo.properties.NAME || geo.properties.name;
    if (!name) return;

    const data = await getCountryByName(name);
    if (data) {
      setSelectedCountry({
        name: data.name.common,
        capital: data.capital?.[0],
        region: data.region,
        population: data.population,
        flag: data.flags?.svg,
      });
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(to right, #f8f9fa, #e9ecef)' }}>
      <Navbar />

      <div className="d-flex justify-content-center align-items-start px-3" style={{ marginTop: '70px' }}>
      
        <div
          className="bg-white shadow rounded-4 border"
          style={{
            width: '95%',
            maxWidth: '1200px',
            height: '640px',
            padding: '20px',
            overflow: 'hidden',
          }}
        >
        <div className="mb-4 text-center">
            <h3
                className="fw-bold"
                style={{
                fontSize: '1.75rem',
                color: '#343a40',
                }}
            >
                <span role="img" aria-label="globe">🌍</span> Select a Country to Explore
            </h3>
        </div>
          <ComposableMap
            projectionConfig={{ scale: 160 }}
            width={980}
            height={551}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              height: '100%',
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: getColor(geo.properties.NAME || geo.properties.name),
                        stroke: '#ffffff',
                        strokeWidth: 0.6,
                        outline: 'none',
                      },
                      hover: {
                        fill: '#007bff',
                        cursor: 'pointer',
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#343a40',
                        outline: 'none',
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {/* 🌍 Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdropClassName="blur-background"
        contentClassName="rounded-4 shadow border-0"
        >
        <Modal.Header closeButton className="bg-dark text-white rounded-top-4">
            <Modal.Title className="fw-bold">{selectedCountry?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center px-4 py-3">
            {selectedCountry?.flag && (
            <div className="mb-4 d-flex justify-content-center">
                <div className="bg-light rounded shadow-sm p-2" style={{ maxWidth: 120 }}>
                <img
                    src={selectedCountry.flag}
                    alt="flag"
                    className="img-fluid rounded"
                    style={{ maxHeight: 100 }}
                />
                </div>
            </div>
            )}

            <div className="text-start">
            <div className="mb-2">
                <span className="fw-semibold text-muted">
                <span role="img" aria-label="capital">🏛️</span> Capital:
                </span>{' '}
                <span className="text-dark">{selectedCountry?.capital || 'N/A'}</span>
            </div>
            <div className="mb-2">
                <span className="fw-semibold text-muted">
                <span role="img" aria-label="region">🌐</span> Region:
                </span>{' '}
                <span className="text-dark">{selectedCountry?.region}</span>
            </div>
            <div>
                <span className="fw-semibold text-muted">
                <span role="img" aria-label="population">👥</span> Population:
                </span>{' '}
                <span className="text-dark">{selectedCountry?.population?.toLocaleString()}</span>
            </div>
            </div>
        </Modal.Body>

        <Modal.Footer className="bg-light rounded-bottom-4 d-flex justify-content-center">
            <Button variant="primary" onClick={handleClose}>
            <span role="img" aria-label="close">✖</span> Close
            </Button>
        </Modal.Footer>
        </Modal>
    </div>
  );
};

export default HomePage;