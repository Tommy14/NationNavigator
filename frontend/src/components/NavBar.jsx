import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisplayBadges from './DisplayBadge';
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
  const [searchQuery, setSearchQuery] = useState("");
  const [continentFilter, setContinentFilter] = useState("");
 
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
 
  // Handle search input change
  const handleSearch = (e) => {
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
        let url = "";
        if (searchQuery) {
          // Search by name
          url = `https://restcountries.com/v3.1/name/${searchQuery}`;
        } else if (continentFilter) {
          // Filter by region
          url = `https://restcountries.com/v3.1/region/${continentFilter}`;
        } else {
          // Fetch all
          url = "https://restcountries.com/v3.1/all";
        }
        const response = await axios.get(url);
        setCountries(response.data);
        onFilterChange(response.data.map((c) => c.name.common));
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
        onFilterChange([]);
      } finally {
        setLoadingCountries(false);
      }
    };
 
    fetchCountries();
  }, [searchQuery, continentFilter, showFilter]);
  return (
    <nav
      className={`
      ${
        theme === "dark"
          ? "bg-gradient-to-r from-[#030712] via-[#0f172a] to-[#1e1b4b] text-[#f8fafc]"
          : "bg-gradient-to-r from-[#e0f2fe] via-[#bfdbfe] to-[#c7d2fe] text-[#1e293b]"
      } shadow-lg relative z-50 border-b ${
        theme === "dark" ? "border-indigo-900/30" : "border-indigo-200/50"
      }`}
    >
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {" "}
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
            src={theme === "dark" ? logoDark : logoLight}
            alt="NationNavigator Logo"
            className={`h-10 w-auto ${
              theme === "dark"
                ? "drop-shadow-[0_0_3px_rgba(165,180,252,0.3)]"
                : ""
            }`}
          />
          <span
            className={`text-2xl font-bold tracking-wide ${
              theme === "dark"
                ? "text-[#f8fafc] drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]"
                : "text-[#0f172a]"
            }`}
          >
            NationNavigator
          </span>
        </button>
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden ml-auto p-1 text-xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
        {/* Nav items */}
        <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } flex-col md:flex md:flex-row md:items-center w-full md:w-auto md:space-x-4 space-y-2 md:space-y-0 px-4 md:px-0 md:ml-auto z-50 absolute top-full left-0 md:static ${
          theme === "dark"
            ? "bg-[#0f172a] md:bg-transparent"
            : "bg-white md:bg-transparent"
        }`}
      >
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter((f) => !f)}
            className={
              `hidden md:inline-block ml-4 p-1 md:p-2 rounded-full transition ` +
              (theme === "dark"
                ? "bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/70 shadow-[0_0_8px_rgba(99,102,241,0.2)]"
                : "bg-indigo-500 hover:bg-indigo-600 text-white")
            }
            title="Toggle Search & Filter"
          >
            <FiFilter size={20} />
          </button>
 
          {/* Light/Dark mode toggle */}
          <button
            onClick={onToggleTheme}
            className={
              `px-10 ml-72 p-1 md:p-2 rounded-full transition ` +
              (theme === "dark"
                ? "bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/70 shadow-[0_0_8px_rgba(99,102,241,0.2)]"
                : "bg-indigo-100 hover:bg-indigo-200 text-indigo-600 border border-indigo-200")
            }
            aria-label={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? (
              <FiSun size={20} className="text-amber-300" />
            ) : (
              <FiMoon size={20} />
            )}
          </button>
          {showFilter && (
            <>
              {" "}
              {/* Search bar & filter panel */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search countries"
                  className={`px-4 py-2 rounded-md shadow-sm ${
                    theme === "dark"
                      ? "bg-indigo-950/60 text-indigo-100 placeholder-indigo-300/60 border border-indigo-700/50"
                      : "bg-white text-indigo-900 placeholder-indigo-400 border border-indigo-200"
                  }`}
                />
              </div>
              <select
                value={continentFilter}
                onChange={handleContinentChange}
                className={`px-4 py-2 rounded-md ml-4 shadow-sm ${
                  theme === "dark"
                    ? "bg-indigo-950/60 text-indigo-100 border border-indigo-700/50"
                    : "bg-white text-indigo-900 border border-indigo-200"
                }`}
              >
                <option value="">Filter by Continent</option>
                <option value="Africa">Africa</option>
                <option value="Americas">Americas</option>
                <option value="Antarctic">Antarctica</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
              </select>
              {loadingCountries ? (
                <div
                  className={`${
                    theme === "dark" ? "text-[#f8fafc]" : "text-[#0f172a]"
                  } ml-4`}
                >
                  Loading...
                </div>
              ) : (
                <div
                  className={`${
                    theme === "dark" ? "text-[#f8fafc]" : "text-[#0f172a]"
                  } ml-4`}
                >
                  {countries.length} countries found
                </div>
              )}
            </>
          )}
 
          {/* Login / Sign Up Button */}
          {user ? (
            <div className="relative flex items-center md:mr-8">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={
                  `flex items-center px-5 py-2 rounded-lg font-bold transition shadow-lg ` +
                  (theme === "dark"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white")
                }
              >
                <FiUser size={20} className="md:hidden" />
                <span className="hidden md:inline">Hi, {user.username}</span>
              </button>
              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-40 rounded-lg shadow-xl z-50 ${
                    theme === "dark"
                      ? "bg-[#0f172a]/90 border border-indigo-700/50"
                      : "bg-white border border-indigo-100"
                  }`}
                >
                  <button
                    onClick={() => {
                      setShowBadges(true);
                      setDropdownOpen(false);
                    }}
                    className={
                      `block w-full text-left px-4 py-2 transition rounded-t-lg ` +
                      (theme === "dark"
                        ? "text-indigo-100 hover:bg-indigo-800/80"
                        : "text-indigo-900 hover:bg-indigo-50")
                    }
                  >
                    View Badges
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className={
                      `block w-full text-left px-4 py-2 transition rounded-b-lg ` +
                      (theme === "dark"
                        ? "text-indigo-100 hover:bg-indigo-800/80"
                        : "text-indigo-900 hover:bg-indigo-50")
                    }
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
                `px-10 ml-72 p-1 md:p-2 rounded-full transition ` +
                (theme === "dark"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white")
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
        <div
          className={
            `fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 ` +
            (theme === "dark"
              ? "bg-black bg-opacity-40"
              : "bg-white bg-opacity-40")
          }
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={
              `bg-opacity-30 backdrop-blur-lg border shadow-xl rounded-2xl w-full max-w-md p-8 relative ` +
              (theme === "dark"
                ? "bg-[#0b1120]/80 border-white/10 text-[#f8fafc]"
                : "bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-100 border-indigo-200 text-indigo-900 shadow-blue-200/50")
            }
          >
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-full shadow-md mb-4 ${
                theme === "dark"
                  ? "bg-indigo-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              }`}>
                <FiUser size={24} />
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${
                theme === "dark"
                  ? "text-indigo-100"
                  : "text-indigo-900"
              }`}>
                Welcome Back
              </h3>
              <p className={`text-sm mb-6 ${
                theme === "dark"
                  ? "text-indigo-200"
                  : "text-indigo-700"
              }`}>
                Login to explore the world!
              </p>
            </div>
 
            <LoginForm onSuccess={() => setShowLogin(false)} theme={theme} />
 
            <div className={`mt-6 text-center text-sm ${
              theme === "dark"
                ? "text-indigo-100"
                : "text-indigo-800"
            }`}>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
                className={`font-semibold hover:underline ${
                  theme === "dark"
                    ? "text-indigo-300"
                    : "text-blue-600"
                }`}
              >
                Create one
              </button>
            </div>
 
            <button
              onClick={() => setShowLogin(false)}
              className={`mt-6 text-sm block mx-auto ${
                theme === "dark"
                  ? "text-indigo-200 hover:text-white"
                  : "text-indigo-600 hover:text-indigo-800"
              }`}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
      
      {showSignup && (
        <div
          className={
            `fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 ` +
            (theme === "dark"
              ? "bg-black bg-opacity-40"
              : "bg-white bg-opacity-40")
          }
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={
              `bg-opacity-30 backdrop-blur-lg border shadow-xl rounded-2xl w-full max-w-md p-8 relative ` +
              (theme === "dark"
                ? "bg-[#0b1120]/80 border-white/10 text-[#f8fafc]"
                : "bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-100 border-indigo-200 text-indigo-900 shadow-blue-200/50")
            }
          >
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-full shadow-md mb-4 ${
                theme === "dark"
                  ? "bg-green-600"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
              }`}>
                <FiUserPlus size={24} />
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${
                theme === "dark"
                  ? "text-green-100"
                  : "text-indigo-900"
              }`}>
                Create Account
              </h3>
              <p className={`text-sm mb-6 ${
                theme === "dark"
                  ? "text-green-200"
                  : "text-indigo-700"
              }`}>
                Join the adventure and explore countries!
              </p>
            </div>
 
            <SignupForm onSuccess={() => setShowSignup(false)} theme={theme} />
 
            <button
              onClick={() => setShowSignup(false)}
              className={`mt-6 text-sm block mx-auto ${
                theme === "dark"
                  ? "text-green-200 hover:text-white"
                  : "text-indigo-600 hover:text-indigo-800"
              }`}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
 
      {/* All Countries List Overlay */}
      {showList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg shadow-lg w-full max-w-4xl bg-opacity-50 h-full max-h-[90vh] overflow-auto ${
              theme === "dark" ? "bg-[#0b1120]" : "bg-[#f8fafc]"
            }`}
          >
            <button
              onClick={() => setShowList(false)}
              className={`p-2 text-right w-full ${
                theme === "dark" ? "text-[#f8fafc]" : "text-[#0f172a]"
              }`}
            >
              ✕
            </button>
            <AllCountries
              onSelectCountry={(country) => {
                onFilterChange(country);
                setShowList(false);
              }}
              theme={theme}
            />
          </div>
        </div>
      )}
    </nav>
  );
};
 
export default Navbar;