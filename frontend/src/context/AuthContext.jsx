import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8003';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          const response = await axios.get(`${API_BASE_URL}/api/auth/profile`);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          // In demo mode, create a mock user
          if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
            console.log('Backend not available, using demo mode');
            setUser({
              _id: 'demo-user',
              email: 'demo@example.com',
              role: 'admin',
              profile: {
                firstName: 'Demo',
                lastName: 'User'
              }
            });
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      // Demo mode login
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('Backend not available, using demo login');
        const demoToken = 'demo-token-' + Date.now();
        const demoUser = {
          _id: 'demo-user',
          email: email || 'demo@example.com',
          role: 'admin',
          profile: {
            firstName: 'Demo',
            lastName: 'User'
          }
        };
        
        localStorage.setItem('token', demoToken);
        setToken(demoToken);
        setUser(demoUser);
        
        return { success: true };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
      
      const { token, ...newUser } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(newUser);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || []
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Utility function for testing different roles (development only)
  const simulateRole = (role) => {
    if (user) {
      setUser({
        ...user,
        role: role
      });
    }
  };

  const value = {
    user,
    token,  // Add this line
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    simulateRole // Add this for testing purposes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};