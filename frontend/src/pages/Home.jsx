import React, { useState, useCallback, useEffect } from "react";
import GlobeVisualization from "../components/GlobeVisualization";
import GlobeControls from "../components/GlobeControls";

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
      {/* Header - takes minimum space needed */}
      <header className="bg-indigo-700 text-white p-3 md:p-4 shadow-md z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">🌍 Globe Explorer</h1>
          <GlobeControls 
            viewMode={viewMode}
            setViewMode={setViewMode}
            toggleRotation={toggleRotation}
            isRotating={isRotating}
            handleResetView={handleResetView}
          />
        </div>
      </header>
      
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