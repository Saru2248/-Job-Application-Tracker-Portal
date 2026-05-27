// ============================================================
// src/context/AuthContext.js — React Authentication Context
// ============================================================
// Provides global authentication state to the entire app.
// Uses React Context API + useReducer for state management.
//
// Features:
//   - login: Store user and token, set auth state
//   - logout: Clear all stored auth data
//   - register: Create account and auto-login
//   - updateUser: Update user profile in context
//   - isAuthenticated: Boolean computed from token
// ============================================================

import React, { createContext, useContext, useReducer, useEffect } from "react";
import axiosInstance from "../api/axios";

// ============================================================
// Create Context
// ============================================================
const AuthContext = createContext(null);

// ============================================================
// Reducer: Manages auth state transitions
// ============================================================
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
};

// ============================================================
// Initial State
// ============================================================
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: true, // Start as loading to check stored token
};

// ============================================================
// AuthProvider Component
// ============================================================
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ---- Load user from stored token on app start ----
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      try {
        // Verify token and get user profile
        const res = await axiosInstance.get("/auth/me");

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: res.data.user,
            token,
          },
        });
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "AUTH_ERROR" });
      }
    };

    loadUser();
  }, []);

  // ---- Register new user ----
  const register = async (userData) => {
    const res = await axiosInstance.post("/auth/register", userData);

    // Store token in localStorage
    localStorage.setItem("token", res.data.token);

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: res.data.user,
        token: res.data.token,
      },
    });

    return res.data;
  };

  // ---- Login user ----
  const login = async (credentials) => {
    const res = await axiosInstance.post("/auth/login", credentials);

    // Store token in localStorage
    localStorage.setItem("token", res.data.token);

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: res.data.user,
        token: res.data.token,
      },
    });

    return res.data;
  };

  // ---- Logout user ----
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
  };

  // ---- Update user data in context ----
  const updateUser = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  // Value provided to all children
  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================
// Custom Hook: useAuth — Easy access to auth context
// ============================================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
