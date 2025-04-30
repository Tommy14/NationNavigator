import { useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = isLogin
        ? await loginUser(form)
        : await registerUser(form);

      // Save token & user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ username: data.username, userId: data.userId }));

      navigate('/'); // Redirect to homepage or dashboard
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button className="text-blue-500 hover:underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;