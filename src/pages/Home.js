// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar for Home role */}
      <Navbar role="home" />
      
      <div className="home-container">
        <h1>Welcome to Sejuk-Sejuk Service</h1>
        <p>Select your portal:</p>

        <div className="button-group">
          <button
            className="portal-btn admin"
            onClick={() => navigate("/login?role=admin")}
          >
            Admin Portal
          </button>

          <button
            className="portal-btn technician"
            onClick={() => navigate("/login?role=technician")}
          >
            Technician Portal
          </button>
        </div>
      </div>
    </div>
  );
}
