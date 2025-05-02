import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { feature } from "topojson-client";

const GlobeVisualization = ({ viewMode = "realistic", isRotating = true, onCountryClick }) => {
  const [countries, setCountries] = useState({ features: [] });
  const [isLoading, setIsLoading] = useState(true);
  const globeRef = useRef();

  const globeImageUrls = {
    realistic: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    night: "//unpkg.com/three-globe/example/img/earth-night.jpg",
    topo: "//unpkg.com/three-globe/example/img/earth-topology.png",
    cartoon: "https://unpkg.com/three-globe/example/img/earth-dark.jpg",
  };

  // Load country data
  useEffect(() => {
    setIsLoading(true);
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((worldData) => {
        const geoData = feature(worldData, worldData.objects.countries);
        geoData.features.forEach((f) => {
          f.properties.randomColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
        });
        setCountries(geoData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading country data:", error);
        setIsLoading(false);
      });
  }, []);

  // Handle rotation based on isRotating prop
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = isRotating;
      controls.autoRotateSpeed = 0.5;
    }
  }, [isRotating]);

  const getPolygonLabel = (d) => {
    if (!d?.properties?.name) return "";
    return `
      <div style="
        background-color: white;
        border-radius: 6px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        padding: 8px 12px;
        font-family: Arial, sans-serif;
        text-align: center;
        color: #333;
        pointer-events: none;
      ">
        <span style="font-weight: bold">${d.properties.name}</span>
      </div>
    `;
  };

  return (
    <div className="flex justify-center items-center h-full w-full overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-lg font-medium">Loading globe data...</div>
        </div>
      ) : (
        <Globe
          ref={globeRef}
          globeImageUrl={globeImageUrls[viewMode]} 
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          polygonsData={countries.features}
          polygonAltitude={0.01}
          polygonCapColor={(d) => (viewMode === "cartoon" ? d.properties.randomColor : "rgba(200, 200, 200, 0.3)")}
          polygonSideColor={() => "rgba(150, 150, 150, 0.2)"}
          polygonStrokeColor={() => "rgba(255, 255, 255, 0.3)"}
          polygonLabel={getPolygonLabel}
          width={window.innerWidth}
          height={window.innerHeight } 
          onPolygonClick={(polygon) => {
            const name = polygon?.properties?.name;
            if (name && onCountryClick) {
              onCountryClick(name);
            }
          }}
        />
      )}
    </div>
  );
};

export default GlobeVisualization;