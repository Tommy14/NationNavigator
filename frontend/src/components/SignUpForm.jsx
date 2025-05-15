import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from './ui/Input';
import Button from './ui/Button';
import Alert from './ui/Alert';
import PasswordStrengthIndicator from './ui/PasswordStrengthIndicator';
 
const SignUpForm = ({ onSuccess, theme }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) setFormErrors(prev => ({ ...prev, [id]: '' }));
    if (submitError) setSubmitError('');
  };
 
  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      onSuccess?.();
      navigate('/');
    } catch (error) {
      setSubmitError(error.message || 'Failed to register. Please try again.');
    }
  };
 
  return (
    <form className={`space-y-6 ${theme === "dark" ? "text-indigo-100" : "text-indigo-900"}`} onSubmit={handleSubmit}>
      {submitError && <Alert type="error" message={submitError} onClose={() => setSubmitError('')} />}
      <Input
        id="username"
        type="text"
        label="Username"
        value={formData.username}
        onChange={handleChange}
        error={formErrors.username}
        required
        autoComplete="username"
        theme={theme}
      />
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
        autoComplete="new-password"
        theme={theme}
      />
      {formData.password && <PasswordStrengthIndicator password={formData.password} theme={theme} />}      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={formErrors.confirmPassword}
        required
        autoComplete="new-password"
        theme={theme}
      />
      <Button type="submit" variant="primary" fullWidth isLoading={loading}>
        Create Account
      </Button>
    </form>
  );
};
 
export default SignUpForm;