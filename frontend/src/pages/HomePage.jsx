import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import Navbar from '../components/Navbar';
import { getCountryByName } from '../services/countryService';
import { Modal, Button } from 'react-bootstrap';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const HomePage = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCountryClick = async (geo) => {
    const name = geo.properties.name || geo.properties.NAME;
    const data = await getCountryByName(name);
    console.log("Selected country data:", data);
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
    <div className="min-vh-100 bg-light">
      <Navbar />

      <div className="pt-5 px-3 d-flex justify-content-center">
        <div style={{ width: '100%', maxWidth: '1200px', height: '600px' }}>
          <ComposableMap
            projectionConfig={{ scale: 160 }}
            width={980}
            height={551}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: { fill: '#D6D6DA', outline: 'none' },
                      hover: { fill: '#FF5722', outline: 'none' },
                      pressed: { fill: '#FF7043', outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCountry?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedCountry?.flag && (
            <img
              src={selectedCountry.flag}
              alt="flag"
              className="img-fluid mb-3"
              style={{ maxHeight: 100 }}
            />
          )}
          <p><strong>Capital:</strong> {selectedCountry?.capital}</p>
          <p><strong>Region:</strong> {selectedCountry?.region}</p>
          <p><strong>Population:</strong> {selectedCountry?.population?.toLocaleString()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;