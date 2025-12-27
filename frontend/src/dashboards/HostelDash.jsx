import React, { useState, useEffect } from 'react';
import API from '../api.js';
import { Home, User, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react';

const HostelDash = () => {
  const [items, setItems] = useState([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get('/resource/hostel/all');
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { roomNumber, studentName };

      if (editingId) {
        // Ensure you use BACKTICKS (`) here, not single quotes
        await API.put(`/resource/hostel/update/${editingId}`, payload);
        setEditingId(null);
      } else {
        await API.post('/resource/hostel/add', payload);
      }

      setRoomNumber('');
      setStudentName('');
      fetchItems();
    } catch (err) {
      console.error("Update Error:", err.response);
      alert("Failed to update: " + (err.response?.data?.message || "Server Error"));
    }
  };

 const deleteItem = async (id) => {
    if (window.confirm("Confirm deletion of this resource?")) {
      try {
        // Log the ID and URL to the console for final debugging
        const url = `/resource/hostel/${id}`;
        console.log("Attempting DELETE to:", url);
        
        await API.delete(url);
        
        // If successful, refresh the list
        fetchItems();
      } catch (err) {
        console.error("Full Delete Error Object:", err);
        alert(err.response?.data?.message || "Action failed. Check API route or permissions.");
      }
    }
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header Section matching AdminDash */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Home className="text-indigo-600" />
              Hostel Management
            </h1>
            <p className="text-slate-500 mt-1">Allocate rooms and monitor occupancy status</p>
          </div>
          <div className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 flex items-center gap-2">
            <ShieldCheck size={14} /> Authorized Manager Access
          </div>
        </header>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Plus size={18} className="text-indigo-500" />
              {editingId ? 'Edit Room Record' : 'Add New Room Resource'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room Identifier</label>
                <input
                  className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
                  placeholder="e.g. Room 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Occupant</label>
                <input
                  className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
                  placeholder="Student Name (Leave empty if vacant)"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setRoomNumber(''); setStudentName(''); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-100 flex items-center gap-2">
                {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
                {editingId ? 'Update Room' : 'Confirm Allocation'}
              </button>
            </div>
          </form>
        </div>

        {/* Inventory List Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Room Inventory</h2>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
              {items.length} Total Rooms
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {items.length > 0 ? items.map(item => (
              <div key={item._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full">
                  <div className={`p-3 rounded-xl ${item.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Home size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-lg text-slate-800">Room {item.roomNumber}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${item.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <User size={14} /> {item.studentName || 'No Occupant Assigned'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setRoomNumber(item.roomNumber);
                      setStudentName(item.studentName);
                      setEditingId(item._id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center">
                <Home className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-medium">No hostel rooms registered in the system.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDash;