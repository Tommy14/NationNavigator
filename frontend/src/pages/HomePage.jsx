import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import Navbar from '../components/Navbar';
import { getCountryByName } from '../services/countryService';
import { Modal, Button } from 'react-bootstrap';
import QuizModal from '../components/QuizModal';
import { useEffect } from 'react';
import axios from 'axios';
import FilterPanel from '../components/FilterPanel';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/Sidebar'; // import at the top


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
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCountryName, setQuizCountryName] = useState('');
  const [filters, setFilters] = useState({ region: '', language: '' });
  const [allCountries, setAllCountries] = useState([]);

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
        languages: data.languages,
      });
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const shouldHighlight = (country) => {
    const regionMatch = !filters.region || country.region === filters.region;
    return regionMatch;
  };

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(res => setAllCountries(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(to right, #f8f9fa, #e9ecef)' }}>
      <Navbar />
      <Sidebar
        region={filters.region}
        setRegion={(r) => setFilters(prev => ({ ...prev, region: r }))}
        language={filters.language}
        setLanguage={(l) => setFilters(prev => ({ ...prev, language: l }))}
        onApply={() => {/* apply logic */}}
        onClear={() => setFilters({ region: '', language: '' })}
        />
      

      <div className="d-flex justify-content-center align-items-start px-3" style={{ marginTop: '70px' }}>
      
        <div
          className="bg-white shadow rounded-4 border"
          style={{
            width: '95%',
            maxWidth: '1200px',
            height: '720px',
            padding: '10px',
            overflow: 'hidden',
          }}
        >
        <Container className="mt-4">
                <FilterPanel onApply={setFilters} />
            </Container>
            <ComposableMap
            projectionConfig={{ scale: 160 }}
            style={{ width: '100%', height: '100%' }}
            >
            <Geographies geography={geoUrl}>
            {({ geographies }) =>
                geographies.map((geo) => {
                // ✅ geo is accessible here

                const name = geo.properties.NAME || geo.properties.name;
                const countryData = allCountries.find(c =>
                    c.name.common === name ||
                    c.name.official === name ||
                    (c.altSpellings && c.altSpellings.includes(name))
                  );
                const isMatch = countryData && shouldHighlight(countryData);
                const fillColor =
                filters.region || filters.language
                    ? (isMatch ? getColor(name) : '#eee')   // Filtering active
                    : getColor(name);                       // No filtering, color all

                return (
                    <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                        default: {
                        fill: fillColor,
                        stroke: '#fff',
                        strokeWidth: 0.6,
                        outline: 'none',
                        },
                        hover: {
                        fill: isMatch ? '#007bff' : '#ddd',
                        cursor: isMatch ? 'pointer' : 'default',
                        },
                        pressed: {
                        fill: '#343a40',
                        outline: 'none',
                        }
                    }}
                    />
                );
                })
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

        <Modal.Body className="px-4 py-3">
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
            <div className="mb-2">
            <span className="fw-semibold text-muted">
                <span role="img" aria-label="population">👥</span> Population:
            </span>{' '}
            <span className="text-dark">{selectedCountry?.population?.toLocaleString()}</span>
            </div>
            <div className="mb-2">
            <span className="fw-semibold text-muted">
                <span role="img" aria-label="languages">🗣️</span> Languages:
            </span>{' '}
            <span className="text-dark">
                {selectedCountry?.languages
                ? Object.values(selectedCountry.languages).join(', ')
                : 'N/A'}
            </span>
            </div>
        </div>
        <Button
            variant="success"
            className="ms-2"
            onClick={() => {
                setQuizCountryName(selectedCountry.name);
                setShowModal(false);         // ✅ Close the details modal
                setShowQuiz(true);           // ✅ Show the quiz
            }}
            >
            🧠 Take Quiz
        </Button>
        </Modal.Body>

        <Modal.Footer className="bg-light rounded-bottom-4 d-flex justify-content-center">
            <Button variant="primary" onClick={handleClose}>
            <span role="img" aria-label="close">✖</span> Close
            </Button>
        </Modal.Footer>
        </Modal>
        <QuizModal
            show={showQuiz}
            onClose={() => setShowQuiz(false)}
            countryName={quizCountryName}
            />
            
    </div>
  );
};

export default HomePage;