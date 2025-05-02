import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider} from './context/AuthContext';
import Home from './pages/Home';
import Navbar from './components/NavBar';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;