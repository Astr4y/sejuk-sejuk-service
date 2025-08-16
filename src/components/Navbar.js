// src/components/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // back to login after logout
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="navbar">
      <h2 onClick={() => navigate("/")}>Sejuk-Sejuk Service</h2>
      <ul className="nav-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/login?role=admin")}>Admin Portal</li>
        <li onClick={() => navigate("/login?role=technician")}>Technician Portal</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
}
