import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import EntryAnimation from './components/EntryAnimation'; // 👈 import the animation

const App = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  return (
    <BrowserRouter>
      <AuthProvider>
        {showAnimation ? (
          <EntryAnimation onComplete={() => setShowAnimation(false)} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
