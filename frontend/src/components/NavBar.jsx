import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisplayBadges from './DisplayBadge'; // Import the DisplayBadges component
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';
import AllCountries from './AllCountries';
import { motion } from 'framer-motion';
import { FiUser, FiUserPlus, FiFilter, FiSun, FiMoon, FiLogIn } from 'react-icons/fi';
import logoDark from '../assets/logo-dark.png';
import logoLight from '../assets/logo-light.png';


const Navbar = ({ onFilterChange, theme, onToggleTheme, onShowAll }) => {
  const [showBadges, setShowBadges] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showList, setShowList] = useState(false);

  // New states for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState('');

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

    // Handle search input change
    const handleSearch = e => {
      // always let the user type freely...
      setSearchQuery(e.target.value);
    };

  // Handle continent filter change
  const handleContinentChange = (e) => {
    setContinentFilter(e.target.value);
  };

  useEffect(() => {
    // If filter panel is closed, clear any existing filters
    if (!showFilter) {
      onFilterChange([]);
      return;
    }
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
  }, [searchQuery, continentFilter, showFilter]);

  return (
    <nav className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} shadow-md relative z-50`}>
      <div className="max-w-1xl mx-auto py-4 flex items-center justify-between">
        {/* Logo - show all countries on click */}
        <button
          onClick={() => {
            setShowList(true);
            setMenuOpen(false);
            setDropdownOpen(false);
          }}
          className="flex items-center space-x-2 ml-4 focus:outline-none"
          aria-label="Show All Countries"
        >
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="NationNavigator Logo"
            className="h-10 w-auto"
          />
          <span className={`text-2xl font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            NationNavigator
          </span>
        </button>
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden ml-4 p-2 text-xl"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        {/* Nav items */}
        <div className={`${menuOpen ? 'flex' : 'hidden'} flex-col md:flex md:flex-row md:items-center w-full md:w-auto md:space-x-4 space-y-2 md:space-y-0 px-4 md:px-0`}>          
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter(f => !f)}
            className={
              `ml-4 p-1 md:p-2 rounded transition ` +
              (theme === 'dark'
                ? 'bg-white hover:bg-gray-200 text-black'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white')
            }
            title="Toggle Search & Filter"
          >
            <FiFilter size={20} />
          </button>
          {/* Light/Dark mode toggle */}
          <button
            onClick={onToggleTheme}
            className={
              `ml-4 p-1 md:p-2 rounded transition ` +
              (theme === 'dark'
                ? 'text-white hover:bg-opacity-20'
                : 'text-indigo-600 ring-2 ring-indigo-500 hover:ring-indigo-400')
            }
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          {showFilter && (
            <> {/* Search bar & filter panel */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search countries"
                  className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'text-black bg-white' : 'text-black bg-gray-100'}`}
                />
              </div>
              <select
                value={continentFilter}
                onChange={handleContinentChange}
                className={`px-4 py-2 rounded-md ml-4 ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-black'}`}
              >
                <option value="">Filter by Continent</option>
                <option value="Africa">Africa</option>
                <option value="Americas">Americas</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
              </select>
              {loadingCountries ? (
                <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} ml-4`}>Loading...</div>
              ) : (
                <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} ml-4`}>{countries.length} countries found</div>
              )}
            </>
          )}

          {/* Login / Sign Up Button */}
          {user ? (
            <div className="relative mr-4 flex items-center">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={
                  `flex items-center px-5 py-2 rounded-lg font-bold transition shadow-lg ring-2 ` +
                  (theme === 'dark'
                    ? 'bg-white text-black hover:bg-blue-400'
                    : 'bg-indigo-600 text-white ring-indigo-400 hover:bg-indigo-500')
                }
              >
                <FiUser size={20} className="md:hidden" />
                <span className="hidden md:inline">Hi, {user.username}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded shadow-lg z-50"
                  style={{backgroundColor: theme === 'dark' ? 'white' : 'white', color: theme === 'dark' ? 'black' : 'black'}}
                >
                  <button
                    onClick={() => {
                      setShowBadges(true);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 transition ` +
                      (theme === 'dark' ? 'text-black hover:bg-gray-100' : 'text-black hover:bg-gray-200')}
                  >
                    View Badges
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 transition ` +
                      (theme === 'dark' ? 'text-black hover:bg-gray-100' : 'text-black hover:bg-gray-200')}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setShowLogin(true);
                setDropdownOpen(false);
              }}
              className={
                `flex items-center px-4 py-2 rounded-md font-semibold transition mr-5 shadow-lg ` +
                (theme === 'dark'
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500')
              }
            >
              <FiLogIn size={20} className="md:hidden mr-5" />
              <span className="hidden md:inline">Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>

      {/* Show DisplayBadges Modal */}
      {showBadges && <DisplayBadges onClose={() => setShowBadges(false)} />}
      {/* Login Modal */}
      {showLogin && (
        <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 ` +
           (theme === 'dark' ? 'bg-black bg-opacity-40' : 'bg-white bg-opacity-40')
        }>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`bg-opacity-30 backdrop-blur-lg border shadow-xl rounded-2xl w-full max-w-md p-8 relative ` +
              (theme === 'dark'
                ? 'bg-white/30 border-white/10 text-white'
                : 'bg-black/10 border-black/20 text-black')
            }
          >
            <div className="flex flex-col items-center">
              <div className="bg-indigo-600 p-3 rounded-full shadow-md mb-4">
                <FiUser size={24} />
              </div>
              <h3 className="text-2xl font-bold text-indigo-100 mb-1">Welcome Back 👋</h3>
              <p className="text-sm text-indigo-200 mb-6">Login to explore the world!</p>
            </div>

            <LoginForm onSuccess={() => setShowLogin(false)} />

            <div className="mt-6 text-center text-sm text-indigo-100">
              Don’t have an account?{' '}
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
                className="text-indigo-300 font-semibold hover:underline"
              >
                Create one
              </button>
            </div>

            <button
              onClick={() => setShowLogin(false)}
              className="mt-6 text-sm text-indigo-200 hover:text-white block mx-auto"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
      {/* Signup Modal */}
      {showSignup && (
        <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 ` +
           (theme === 'dark' ? 'bg-black bg-opacity-40' : 'bg-white bg-opacity-40')
        }>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`bg-opacity-30 backdrop-blur-lg border shadow-xl rounded-2xl w-full max-w-md p-8 relative ` +
              (theme === 'dark'
                ? 'bg-white/30 border-white/10 text-white'
                : 'bg-black/10 border-black/20 text-black')
            }
          >
            <div className="flex flex-col items-center">
              <div className="bg-green-600 p-3 rounded-full shadow-md mb-4">
                <FiUserPlus size={24} />
              </div>
              <h3 className="text-2xl font-bold text-green-100 mb-1">Create Account</h3>
              <p className="text-sm text-green-200 mb-6">Join the adventure and explore countries!</p>
            </div>

            <SignupForm onSuccess={() => setShowSignup(false)} />

            <button
              onClick={() => setShowSignup(false)}
              className="mt-6 text-sm text-green-200 hover:text-white block mx-auto"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
      {/* All Countries List Overlay */}
      {showList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg shadow-lg w-full max-w-4xl h-full max-h-[90vh] overflow-auto">
            <button
              onClick={() => setShowList(false)}
              className="p-2 text-right w-full text-black"
            >✕</button>
            <AllCountries
              onSelectCountry={(country) => {
                setShowList(false);
                onShowAll && onShowAll(country);
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;