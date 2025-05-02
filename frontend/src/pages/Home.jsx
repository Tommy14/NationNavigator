import React, { useState, useCallback, useEffect } from "react";
import GlobeVisualization from "../components/GlobeVisualization";
import GlobeControls from "../components/GlobeControls";
import { fetchCountryDetails } from "../services/countryService";
import Navbar from "../components/NavBar";


export default function Home() {
  // Globe configuration state
  const [viewMode, setViewMode] = useState("realistic");
  const [isRotating, setIsRotating] = useState(true);
  
  // Functions to control the globe
  const toggleRotation = useCallback(() => {
    setIsRotating(prev => !prev);
  }, []);
  
  const handleResetView = useCallback(() => {
    // This will be implemented in the GlobeVisualization component
    // We're just providing the function here for the controls
    console.log("Reset view triggered");
    // You might want to trigger a ref method from GlobeVisualization
  }, []);

  const handleCountryClick = useCallback(async (countryName) => {
    const countryData = await fetchCountryDetails(countryName);
    if (countryData) {
      console.log("Country Data:", countryData);
    }
  }, []);

  return (
    
    <div className="w-full h-full flex flex-col">      
      {/* Main content - takes all remaining space */}
      <main className="flex-grow relative">
        <GlobeVisualization 
          viewMode={viewMode}
          isRotating={isRotating}
          onCountryClick={handleCountryClick}
        />
      </main>
    </div>
  );
}