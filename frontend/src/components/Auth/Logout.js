import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';


const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  }, [logout, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;