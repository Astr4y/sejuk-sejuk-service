// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AdminOrderForm from "./pages/AdminOrderForm";
import TechnicianPortal from "./pages/TechnicianPortal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={(user) => console.log("User logged in:", user)} />} />
        <Route path="/admin" element={<AdminOrderForm />} />
        <Route path="/technician" element={<TechnicianPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
