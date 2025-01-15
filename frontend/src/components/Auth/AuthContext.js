import React, { createContext, useState, useEffect } from 'react';
import { getToken, login as authLogin, logout as authLogout } from '../../services/authService';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  const updatelogin = () => {
    setIsLoggedIn(true);
  };

  const updatelogout = () => {
    setIsLoggedIn(false);
  };

  const login = async (credentials) => {
    return authLogin(credentials, updatelogin); // Pass the update function
  };

  const logout = () => {
    authLogout(updatelogout); // Pass the update function
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};