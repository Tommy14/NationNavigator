import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import PasswordStrengthIndicator from '../components/ui/PasswordStrengthIndicator';

const Signup = () => {
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
    
    // Clear errors when user types
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
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
        password: formData.password
      });
      navigate('/'); // Redirect to home page on successful registration
    } catch (error) {
      setSubmitError(error.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {submitError && <Alert type="error" message={submitError} onClose={() => setSubmitError('')} />}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            id="username"
            type="text"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            error={formErrors.username}
            required
            autoComplete="username"
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
          />
          
          {formData.password && <PasswordStrengthIndicator password={formData.password} />}
          
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;