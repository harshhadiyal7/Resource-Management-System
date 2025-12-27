import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get the role passed from the Selection Page (Student, Hostel, etc.)
  // Default to 'student' if no state is found
  const role = location.state?.role || 'student';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
        alert(errorMessage);
    }
  };


  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-10 rounded-2xl shadow-2xl border border-blue-500/10 w-full max-w-md">
        {/* Dynamic Title based on the role */}
        <h2 className="text-2xl font-serif font-bold text-center mb-8 capitalize text-white">
          {role} Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder={role === 'admin' ? "Enter Your Email ID..." : "Enter Email Address"}
            className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password..."
            className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-sm text-slate-400">
            Don't have an account?
            <button
              type="button"
              onClick={() => navigate(`/register/${role}`)}
              className="text-blue-400 hover:text-blue-300 underline ml-1 font-bold transition-colors"
            >
              Register
            </button>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg shadow-blue-500/20">
            {role === 'admin' ? 'Log In' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;