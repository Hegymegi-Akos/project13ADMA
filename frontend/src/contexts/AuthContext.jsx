import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const getToken = () => localStorage.getItem('token');
  const [user, setUser] = useState(() => (getToken() ? authAPI.getStoredUser() : null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      const token = getToken();

      if (!token) {
        if (user) setUser(null);
        return;
      }

      // Token alapveto ellenorzese lokálisan (lejarat, formatum)
      try {
        const parts = token.split('.');
        if (parts.length !== 2) throw new Error('Hibas token formatum');
        const payload = JSON.parse(atob(parts[0]));
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
          throw new Error('Lejart token');
        }
      } catch {
        authAPI.logout();
        setUser(null);
        return;
      }

      if (!user) {
        try {
          const me = await authAPI.getCurrentUser();
          if (me && me.id) {
            setUser(me);
            localStorage.setItem('user', JSON.stringify(me));
          } else {
            authAPI.logout();
            setUser(null);
          }
        } catch (err) {
          console.error('Nem sikerült beolvasni a felhasználót', err);
          authAPI.logout();
          setUser(null);
        }
      }
    };
    initUser();
  }, [user]);

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(identifier, password);
      if (data.token && data.user) setUser(data.user);
      else if (data.message) setError(data.message);
      return data;
    } catch (err) {
      setError('Nem sikerült bejelentkezni.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.register(payload);
      if (data.token && data.user) setUser(data.user);
      else if (data.message) setError(data.message);
      return data;
    } catch (err) {
      setError('Nem sikerült regisztrálni.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user && !!getToken(), loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
