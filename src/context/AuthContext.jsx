import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // add userType
  const [loading, setLoading] = useState(true);

  // On mount, fetch user/admin profile using the token cookie
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      // First, try admin endpoint (admins are less frequent)
      const resAdmin = await API.get("/admin/me", { withCredentials: true });
      if (resAdmin.data.success) {
        setUser(resAdmin.data.admin);
        setUserType("admin");
        return;
      }

      // Then try user endpoint
      const resUser = await API.get("/user/me", { withCredentials: true });
      if (resUser.data.success) {
        setUser(resUser.data.user);
        setUserType("user");
      }
    } catch (err) {
      setUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

 const login = async (email, password) => {
  try {
    const res = await API.post('/auth/login', { email, password }, { withCredentials: true });
    if (!res.data.success) return { success: false, message: res.data.message };

    // Fetch profile depending on type
    const profileRes = await API.get(res.data.type === 'admin' ? '/admin/me' : '/user/me', { withCredentials: true });

    setUser(profileRes.data.admin || profileRes.data.user);
    setUserType(res.data.type);

    return { success: true, type: res.data.type };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Login failed' };
  }
};


  const register = async (formData) => {
    try {
      const res = await API.post("/auth/register", formData);
      if (res.data.success) {
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Register failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setUserType(null);
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, userType, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};