import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from './ui/Input';
import Button from './ui/Button';
import Alert from './ui/Alert';
 
const LoginForm = ({ onSuccess, theme }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) setFormErrors(prev => ({ ...prev, [id]: '' }));
    if (submitError) setSubmitError('');
  };
 
  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(formData);
      onSuccess?.(); // Close modal
      setTimeout(() => navigate('/'), 100); // Smooth redirect
    } catch (error) {
      setSubmitError(error.message || 'Failed to login. Please try again.');
    }
  };
 
  return (
    <form className={`space-y-6 ${theme === "dark" ? "text-indigo-100" : "text-indigo-900"}`} onSubmit={handleSubmit}>
      {submitError && <Alert type="error" message={submitError} onClose={() => setSubmitError('')} />}
      <Input
        id="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        required
        autoComplete="email"
        theme={theme}
      />
      <Input
        id="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
        required
        autoComplete="current-password"
        theme={theme}
      />
      <Button type="submit" variant="primary" fullWidth isLoading={loading}>
        Sign in
      </Button>
    </form>
  );
};
 
export default LoginForm;