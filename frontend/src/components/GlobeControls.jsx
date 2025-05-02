import React from "react";

const GlobeControls = ({ viewMode, setViewMode, toggleRotation, isRotating, handleResetView }) => {
  const globeImageUrls = {
    realistic: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    night: "//unpkg.com/three-globe/example/img/earth-night.jpg",
    topo: "//unpkg.com/three-globe/example/img/earth-topology.png",
    cartoon: "https://unpkg.com/three-globe/example/img/earth-dark.jpg",
  };

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-3 px-4">
      {Object.keys(globeImageUrls).map(mode => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${
            viewMode === mode
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)} View
        </button>
      ))}

      <button
        onClick={toggleRotation}
        className={`px-4 py-2 rounded-full text-sm shadow-sm ${
          isRotating
            ? "bg-purple-600 text-white"
            : "bg-white text-purple-700 border border-purple-300"
        }`}
      >
        {isRotating ? "Pause" : "Rotate"}
      </button>

      <button
        onClick={handleResetView}
        className="px-4 py-2 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
      >
        Reset
      </button>
    </div>
  );
};

export default GlobeControls;