// src/components/AllCountries.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryDetails from './CountryDetails';
import { FiX } from 'react-icons/fi';

export default function AllCountries({ onClose }) {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState('');
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
  // Filtered countries
  const filtered = countries
    .filter(c =>
      c.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      && (continentFilter === '' || c.region === continentFilter)
    );
  return (
      <div
        className="relative bg-gray-900 bg-opacity-60 backdrop-blur-xl rounded-lg text-white w-11/12 max-w-4xl mx-auto p-6 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">All Countries</h2>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search countries"
            className="px-4 py-2 rounded-md bg-gray-800 text-white w-full sm:w-1/2 focus:outline-none"
          />
          <select
            value={continentFilter}
            onChange={e => setContinentFilter(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 text-white w-full sm:w-1/4 focus:outline-none"
          >
            <option value="">All Continents</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
            <option value="Antarctic">Antarctica</option>
          </select>
        </div>

        

        {/* Flag grid with scroll */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 overflow-y-auto"
          style={{ maxHeight: '60vh' }}
        >
          {filtered.map(c => (
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