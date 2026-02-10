import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectionPage from "./pages/SelectionPage.jsx";
import UserTypeSelection from "./pages/UserTypeSelection.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardWrapper from "./components/DashboardWrapper.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import API from "./api.js";
import { useState } from "react";
import { useEffect } from "react";

const App = () => {
   const [data, setData] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        const res = await fetch(
          "https://resource-management-system-backend.onrender.com/api/auth/test"
        );

        const result = await res.json();
        console.log("API Response:", result);
        setData(result);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    testAPI();
  }, []);

  console.log(data);

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