import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in sessionStorage on initial load
    const storedUser = sessionStorage.getItem('travelMateUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://travel-backend-8eg5.onrender.com/api/auth/login', {
        email,
        password,
      });
      
      const loggedInUser = response.data;
      setUser(loggedInUser);
      sessionStorage.setItem('travelMateUser', JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('travelMateUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

