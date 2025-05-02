import React from "react";

const FullScreenLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      {children}
    </div>
  );
};

export default FullScreenLayout;