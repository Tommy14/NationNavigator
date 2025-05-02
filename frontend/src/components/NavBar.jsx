import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm.jsx';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-black text-white shadow-md relative z-50">
      <div className="max-w-1xl mx-auto py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white tracking-wide ml-4">
          Country Explorer
        </Link>

        {/* Login / Sign Up Button */}
        {user ? (
        <div className="relative mr-4">
            <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="bg-white text-indigo-700 px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
            Hi, {user.username}
            </button>
            {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                <button
                onClick={() => {
                    logout();
                    setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                Logout
                </button>
            </div>
            )}
        </div>
        ) : (
        <button
            onClick={() => {
            setShowSignup(false);
            setShowLogin(true);
            }}
            className="bg-white text-indigo-700 px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition mr-3"
        >
            Login / Sign Up
        </button>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Welcome Back 👋</h3>
            <LoginForm onSuccess={() => {
                setShowLogin(false);
                navigate('/'); // from parent
            }} />
            <div className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
                className="text-indigo-600 font-medium hover:underline"
              >
                Create one
              </button>
            </div>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 block mx-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Create Account</h3>
            <SignupForm onSuccess={() => setShowSignup(false)} />
            <button
              onClick={() => setShowSignup(false)}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 block mx-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;