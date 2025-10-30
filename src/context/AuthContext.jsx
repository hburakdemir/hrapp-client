import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../api/core/axios";
import { authAPI } from "../api/modules/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Logout fonksiyonu
  const logout = useCallback(async () => {
    try {
      // Backend'e logout isteği gönder (cookie'yi temizlemek için)
      await authAPI.logout();
    } catch (error) {
      console.error("Logout hatası:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }, []);

  // Token yenileme - refresh token cookie'den otomatik gelecek
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await authAPI.refresh();
      
      const newAccessToken = response.data.data.accessToken;
      setToken(newAccessToken);
      localStorage.setItem("token", newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error("Token yenileme hatası:", error);
      logout();
      return null;
    }
  }, [logout]);

  // Her 14 dakikada bir otomatik token yenile
  useEffect(() => {
    if (!token) return;

    // İlk yükleme sonrası 14 dakika bekle
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000); // 14 dakika

    return () => clearInterval(interval);
  }, [token, refreshAccessToken]);

  // Axios interceptor - 401 hatalarında token yenile
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 401 hatası ve daha önce denenmemiş
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Auth endpoint'lerinde token yenileme yapma
          const isAuthEndpoint = 
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/refresh");

          if (isAuthEndpoint) {
            return Promise.reject(error);
          }

          // Token'ı yenile
          const newToken = await refreshAccessToken();

          if (newToken) {
            // Yeni token ile isteği tekrar yap
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }

        // Diğer 401/403 hataları
        if (error.response?.status === 401 || error.response?.status === 403) {
          const isAuthEndpoint =
            error.config?.url?.includes("/auth/login") ||
            error.config?.url?.includes("/auth/register");
          
          if (!isAuthEndpoint) {
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken, logout]);

  const login = ({ accessToken, user }) => {
    // Artık sadece accessToken ve user alıyoruz
    // refreshToken cookie'de
    setToken(accessToken);
    setUser(user);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { api };