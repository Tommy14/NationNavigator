// src/components/AllCountries.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryDetails from './CountryDetails';
import { FiX } from 'react-icons/fi';

export default function AllCountries({ onClose }) {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Fetch all countries once
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('https://restcountries.com/v3.1/all');
        setCountries(data);
      } catch (err) {
        console.error('Failed to load countries:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-white">Loading countries…</div>
    );
  }

  // Show details view
  if (selectedCountry) {
    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedCountry(null)}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          ← Back to all countries
        </button>
        <CountryDetails country={selectedCountry} />
      </div>
    );
  }

  // Main modal
  return (
      <div
        className="relative bg-gray-900 bg-opacity-80 backdrop-blur-xl rounded-lg text-white w-11/12 max-w-4xl mx-auto p-6 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">All Countries</h2>

        {/* Flag grid with scroll */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 overflow-y-auto"
          style={{ maxHeight: '60vh' }}
        >
          {countries.map(c => (
            <div
              key={c.cca3}
              className="cursor-pointer text-center hover:shadow-xl rounded-lg overflow-hidden transition"
              onClick={() => setSelectedCountry(c)}
            >
              <img
                src={c.flags.svg}
                alt={`Flag of ${c.name.common}`}
                className="w-full h-24 object-cover"
              />
              <p className="mt-2 font-medium text-white truncate">
                {c.name.common}
              </p>
            </div>
          ))}
        </div>
      </div>
  );
}