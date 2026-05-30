// context/AuthContext.jsx
import axios from "../utils/axios.js"
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      console.log("Profile data:", res.data.user); 
      setUser(res.data.user);
    } catch (error) {
      console.error("Get profile error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

 const login = async (data) => {
  try {
    const res = await axios.post("/api/auth/login", data);

    await getProfile();

    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);

    // backend ka real message throw karo
    throw error.response?.data?.message || "Login failed";
  }
};

    const register = async (data) => {
    try {
      const res = await axios.post("/api/auth/register", data);
      
      // After successful registration, get user profile
      await getProfile();
      
      return res.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}