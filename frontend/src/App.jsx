import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectionPage from "./pages/SelectionPage.jsx";
import UserTypeSelection from "./pages/UserTypeSelection.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardWrapper from "./components/DashboardWrapper.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<SelectionPage />} /> 
        
        
        <Route path="/user-selection" element={<UserTypeSelection />} />
        
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register/:type" element={<RegisterPage />} />
        
        
        <Route path="/dashboard" element={<DashboardWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;