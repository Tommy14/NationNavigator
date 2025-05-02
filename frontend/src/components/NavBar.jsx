import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisplayBadges from './DisplayBadge'; // Import the DisplayBadges component

const Navbar = ({ onFilterChange }) => {
  const [showBadges, setShowBadges] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // New states for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState('');

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const nameToCca3 = Object.fromEntries(
    allCountries.map(c => [c.name.common.toLowerCase(), c.cca3])
  );
  const handleSearch = e => {
    const q = e.target.value.toLowerCase();
    const code = nameToCca3[q];
    setSearchQuery(code || '');  // searches by code
  };

  // Handle continent filter change
  const handleContinentChange = (e) => {
    setContinentFilter(e.target.value);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        let url = '';
        if (searchQuery) {
          // Search by name
          url = `https://restcountries.com/v3.1/name/${searchQuery}`;
        } else if (continentFilter) {
          // Filter by region
          url = `https://restcountries.com/v3.1/region/${continentFilter}`;
        } else {
          // Fetch all
          url = 'https://restcountries.com/v3.1/all';
        }
        const response = await axios.get(url);
        setCountries(response.data);
        onFilterChange(response.data.map(c => c.name.common));
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountries([]);
        onFilterChange([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, [searchQuery, continentFilter]);

  return (
    <nav className="bg-black text-white shadow-md relative z-50">
      <div className="max-w-1xl mx-auto py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white tracking-wide ml-4">
          Country Explorer
        </Link>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search countries"
            className="px-4 py-2 rounded-md text-black"
          />
        </div>

        {/* Continent Filter */}
        <select
          value={continentFilter}
          onChange={handleContinentChange}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          <option value="">Filter by Continent</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>

        {loadingCountries ? (
          <div className="text-white ml-4">Loading...</div>
        ) : (
          <div className="text-white ml-4">{countries.length} countries found</div>
        )}

        {/* Login / Sign Up Button */}
        {user ? (
          <div className="relative mr-4">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-white text-indigo-700 px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Hi, {user.username}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    setShowBadges(true);
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  View Badges
                </button>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              setShowBadges(false);
              setDropdownOpen(false);
            }}
            className="bg-white text-indigo-700 px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition mr-3"
          >
            Login / Sign Up
          </button>
        )}
      </div>

      {/* Show DisplayBadges Modal */}
      {showBadges && <DisplayBadges onClose={() => setShowBadges(false)} />}
    </nav>
  );
};

export default Navbar;