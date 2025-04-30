const API = 'http://localhost:5001/api/users';

export const loginUser = async (userData) => {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json();
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  return res.json();
};