import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // ✅

const AuthDropdown = ({ show, handleClose }) => {
  const { login } = useAuth(); // ✅
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

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
      
      // ✅ Put it HERE:
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        userId: data.userId
      }));
  
      // Optional: set user in context if using useAuth
      login({ username: data.username, userId: data.userId });
  
      handleClose(); // close modal
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? 'Login' : 'Register'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Button variant="link" size="sm" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register' : 'Login'}
            </Button>
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthDropdown;