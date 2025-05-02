// src/components/AllCountries.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryDetails from './CountryDetails';

export default function AllCountries() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Fetch all countries on mount
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

  // 2) Show loader while fetching
  if (loading) {
    return <div className="p-4 text-center">Loading countries…</div>;
  }

  // 3) If one is selected, show CountryDetails + back button
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

  // 4) Otherwise render the flag grid
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {countries.map((c) => (
        <div
          key={c.cca3}
          className="cursor-pointer text-center hover:shadow-lg rounded overflow-hidden transition"
          onClick={() => setSelectedCountry(c)}
        >
          <img
            src={c.flags.svg}
            alt={`Flag of ${c.name.common}`}
            className="w-full h-24 object-cover"
          />
          <p className="mt-2 font-medium">{c.name.common}</p>
        </div>
      ))}
    </div>
  );
}