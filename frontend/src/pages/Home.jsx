import React, { useState, useCallback, useEffect } from "react";
import Navbar from '../components/NavBar';
import GlobeVisualization from "../components/GlobeVisualization";
import GlobeControls from "../components/GlobeControls";
import { fetchCountryDetails } from "../services/countryService";
import CountryDetails from '../components/CountryDetails';

export default function Home() {
  const [viewMode, setViewMode] = useState("realistic");
  const [isRotating, setIsRotating] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountryNames, setFilteredCountryNames] = useState([]);

  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between dark and light modes
  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleRotation = useCallback(() => {
    setIsRotating(prev => !prev);
  }, []);

  const handleResetView = useCallback(() => {
    console.log("Reset view triggered");
  }, []);

  const handleCountryClick = useCallback(async (countryName) => {
    try {
      const countryData = await fetchCountryDetails(countryName);
      if (countryData) {
        setSelectedCountry(countryData); // 💡 store in state
      }
      console.log("COuntry data:", countryData);
    } catch (err) {
      console.error("Failed to fetch country:", err);
    }
  }, []);

  return (
    <div
      className={`w-full h-full flex flex-col ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onFilterChange={setFilteredCountryNames}
      />
      {/* Main content */}
      <main className="flex-grow relative">
        <GlobeVisualization 
          viewMode={viewMode}
          isRotating={isRotating}
          onCountryClick={handleCountryClick}
          filteredCountryNames={filteredCountryNames}
          theme={theme}
        />
      </main>

      {/* Optional: Add a close button for country info */}
      {selectedCountry && (
      <div className="absolute bottom-8 right-8 z-10">
        <CountryDetails country={selectedCountry} />
      </div>
      )}
    </div>
  );
}