import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  Package,
  ShieldAlert,
  RefreshCw,
  Home,
  PenTool,
  RefreshCw as RefreshIcon
} from 'lucide-react';
import API from '../api.js';

const AdminDash = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetching all admin resources
      const [userRes, canteenRes, hostelRes, stationeryRes] = await Promise.all([
        API.get('/resource/admin/users'),
        API.get('/resource/canteen/all'),
        API.get('/resource/hostel/all'),
        API.get('/resource/stationery/all')
      ]);

      const canteenData = canteenRes.data.map(item => ({
        ...item,
        type: 'Canteen',
        displayTitle: item.itemName,
        status: item.quantity > 0 ? 'Available' : 'Out of Stock',
        color: 'emerald'
      }));

      const hostelData = hostelRes.data.map(item => ({
        ...item,
        type: 'Hostel',
        displayTitle: `Room ${item.roomNumber}`,
        icon: <Home size={14} />,
        color: 'blue'
      }));

      const stationeryData = stationeryRes.data.map(item => ({
        ...item,
        type: 'Stationery',
        displayTitle: item.itemName,
        icon: <PenTool size={14} />,
        color: 'purple'
      }));

      setUsers(userRes.data);
      setItems([...canteenData, ...hostelData, ...stationeryData].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      ));

    } catch (err) {
      console.error("Critical error loading system data:", err);
      if (err.response?.status === 401) {
        alert("Session Expired or Unauthorized. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    try {
      await API.put(`/resource/admin/user-status/${id}`, { status: newStatus });
      setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert("Failed to update security credentials.");
    }
  };

  // 1. Add this function inside your AdminDash component
  // Check line 20-22 of your AdminDash.jsx

// Fix the handleDeleteUser function
const handleDeleteUser = async (id, name) => {
  if (window.confirm(`Are you sure?`)) {
    try {
      await API.put(`/resource/admin/user-status/${id}`, { status: 'deleted' });
      
      // Ensure you are using 'users' (the state variable) here
      setUsers(users.map(u => u._id === id ? { ...u, status: 'deleted' } : u));
    } catch (err) {
      console.error(err);
    }
  }
};;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-slate-400 font-medium">Syncing System Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShieldCheck className="text-blue-500" />
              System <span className="text-blue-400">Administration</span>
            </h1>
            <p className="text-slate-400 mt-1">Manage users and monitor cross-department inventory</p>
          </div>
          <button
            onClick={loadAdminData}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <RefreshCw size={16} /> Refresh System
          </button>
        </header>

        {/* SECTION 1: USER ACCESS CONTROL */}
        <section>
          <div className="bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users size={22} className="text-blue-400" />
                User Access Control
              </h2>
              <span className="text-xs font-black px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full uppercase tracking-tighter">
                {users.length} Registered Users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0f172a]/50 text-slate-500 text-[11px] uppercase tracking-[0.2em] font-black">
                  <tr>
                    <th className="px-8 py-5">User Details</th>
                    <th className="px-8 py-5">Security Role</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-blue-500/5 transition-colors group">
                      <td className="px-8 py-4">
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-tighter">ID: {user._id.slice(-6)}</p>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-[10px] font-black px-2 py-1 bg-slate-900 text-blue-300 border border-slate-700 rounded uppercase">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                          {user.status}
                        </div>
                      </td>
                      {/* // 2. Update the Action column in your JSX */}
                      <td className="px-8 py-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all border ${user.status === 'active'
                            ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                            }`}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>

                        {/* NEW DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="px-4 py-2 rounded-lg text-xs font-black transition-all border border-slate-700 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVE INVENTORY */}
        <section>
          <div className="bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-800">
            <div className="p-6 border-b border-slate-800 bg-slate-800/30 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package size={22} className="text-blue-400" />
                Live Inventory Monitor
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.length > 0 ? items.map((item) => (
                <div key={item._id} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl bg-slate-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                      {item.icon || <Package size={20} />}
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${(item.status === 'Available' || item.status === 'In Stock')
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-rose-500/10 text-rose-400'
                      }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-lg mb-1">{item.displayTitle}</h3>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {item.type}
                    </span>
                    {item.price && (
                      <p className="text-sm font-bold text-blue-400 bg-blue-500/5 px-3 py-1 rounded-lg border border-blue-500/10">
                        ₹{item.price}
                      </p>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <Package className="mx-auto text-slate-700 mb-4" size={60} />
                  <p className="text-slate-500 text-lg italic font-medium">No live resources found</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900/50 rounded-b-3xl text-center border-t border-slate-800">
              <p className="text-[10px] text-blue-500/60 uppercase font-black tracking-[0.3em]">
                Real-time Database Sync Active
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDash;