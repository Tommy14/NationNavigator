import React, { useState, useCallback, useEffect, useRef } from "react";
import { MdMusicNote, MdMusicOff } from 'react-icons/md';
import Navbar from '../components/NavBar';
import GlobeVisualization from "../components/GlobeVisualization";
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

  const handleCountryClick = useCallback(async (countryName) => {
    try {
      const countryData = await fetchCountryDetails(countryName);
      if (countryData) {
        setSelectedCountry(countryData); // 💡 store in state
      }
      console.log("Country data:", countryData);
    } catch (err) {
      console.error("Failed to fetch country:", err);
    }
  }, []);

const [isPlaying, setIsPlaying] = useState(false);
const audioRef = useRef(null);

useEffect(() => {
  audioRef.current = new Audio("/audio/background.mp3");
  audioRef.current.loop = true;
  audioRef.current.volume = 1;
  // Do not auto-play here

  return () => {
    audioRef.current.pause();
    audioRef.current = null;
  };
}, []);

const toggleAudio = () => {
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }
};

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
          <CountryDetails
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
            theme={theme}
          />
        </div>
      )}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 left-6 z-50 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? <MdMusicNote size={20} /> : <MdMusicOff size={20} />}
      </button>
    </div>
  );
}
