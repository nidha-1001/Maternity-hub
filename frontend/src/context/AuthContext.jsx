import React, { createContext, useState, useEffect } from "react";
import { loginApi, registerApi, getProfileApi, updateProfileApi } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await getProfileApi();
          setUser(data);
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  // Register handler
  const register = async (userData) => {
    const { data } = await registerApi(userData);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    const { data } = await updateProfileApi(profileData);
    setUser((prev) => ({ ...prev, ...data }));
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
