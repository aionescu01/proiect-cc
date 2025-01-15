import axios from 'axios';

const API_URL = 'http://localhost:5002';

export const login = async (credentials, updatelogin) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  localStorage.setItem('token', response.data.token);
  if (updatelogin) {
    updatelogin();
  }
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = (updatelogout) => {
  localStorage.removeItem('token');
  if (updatelogout) {
    updatelogout();
  }
};