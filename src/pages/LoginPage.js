import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in as:", userCredential.user);

      if (role === "admin" && email === "admin@sejuk.com") {
        navigate("/admin");
      } else if (role === "technician" && email === "technician@sejuk.com") {
        navigate("/technician");
      } else {
        setError("Unauthorized role or email.");
      }
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      setError("Invalid email or password.");
    }
  };

  return (
    <div>
      <Navbar title="Login" />
      <div className="login-container">
        <h2>{role === "admin" ? "Admin Login" : "Technician Login"}</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
