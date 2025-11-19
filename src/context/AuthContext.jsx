// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { authAPI } from "../api/modules/auth";
import api from "../api/core/axios";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // logout fonksiyonu
  const logout = useCallback(async () => {
    try {
      await authAPI.logout(); // backend logout (cookie temizleme)
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setToken(null);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  // token refresh
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await authAPI.refresh(); // backend refresh
      const newToken = res.data.data.accessToken;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      return newToken;
    } catch (err) {
      console.error("Token refresh error:", err);
      logout();
      return null;
    }
  }, [logout]);

  // axios interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      res => res,
      async err => {
        const originalReq = err.config;
        if (err.response?.status === 401 && !originalReq._retry) {
          originalReq._retry = true;
          const isAuthEndpoint = ["/auth/login", "/auth/register", "/auth/refresh"].some(path =>
            originalReq.url?.includes(path)
          );
          if (isAuthEndpoint) return Promise.reject(err);

          const newToken = await refreshAccessToken();
          if (newToken) {
            originalReq.headers.Authorization = `Bearer ${newToken}`;
            return api(originalReq);
          }
        }

        if ([401, 403].includes(err.response?.status)) {
          const isAuthEndpoint = ["/auth/login", "/auth/register"].some(path =>
            err.config?.url?.includes(path)
          );
          if (!isAuthEndpoint) logout();
        }

        return Promise.reject(err);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [refreshAccessToken, logout]);

  // login fonksiyonu
  const login = ({ accessToken }) => {
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
  };

  // decoded user bilgisi
  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token); // { userId, role, iat, exp, name, surname ...}
    } catch {
      return null;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export { api };
