import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import CustomerDashboard from './components/Dashboard/CustomerDashboard';
import WaiterDashboard from './components/Dashboard/WaiterDashboard';
import ChefDashboard from './components/Dashboard/ChefDashboard';
import AdminDashboard from "./components/Dashboard/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
          <Route path="/chef-dashboard" element={<ChefDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;