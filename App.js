import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import CurrencyConverter from "./CurrencyConverter";
import "./Dashboard.css";
import "./CurrencyConverter.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Dashboard page (only for authenticated users)
function Dashboard({ toggleDark, darkMode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container" style={{ position: "relative" }}>
      <button className="dark-toggle-btn" onClick={toggleDark} title="Toggle dark mode">
        {darkMode ? "🌙" : "☀️"}
      </button>
      <div className="dashboard-header">
        <h2>Welcome, {currentUser.email}!</h2>
        <button className="logout-btn" onClick={() => signOut(auth)}>
          Logout
        </button>
      </div>
      <CurrencyConverter />
    </div>
  );
}

function AppRoutes({ toggleDark, darkMode }) {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? (
            <Dashboard toggleDark={toggleDark} darkMode={darkMode} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          !currentUser ? (
            <Login />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/signup"
        element={
          !currentUser ? (
            <Signup />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      {/* Add more routes as needed */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  // Detect system dark mode preference on first load
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDark = () => setDarkMode((d) => !d);

  return (
    <AuthProvider>
      <AppRoutes toggleDark={toggleDark} darkMode={darkMode} />
    </AuthProvider>
  );
}