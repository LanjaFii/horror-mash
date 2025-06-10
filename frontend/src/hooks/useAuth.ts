import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const login = useCallback(async (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    navigate('/');
  }, [navigate]);

  const logout = useCallback(() => {
    clearAuth();
    navigate('/auth', { replace: true });
  }, [clearAuth, navigate]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return { isAuthenticated, user, loading, login, logout };
};

export default useAuth;