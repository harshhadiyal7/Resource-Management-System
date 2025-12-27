import React, { useEffect, useState } from 'react';
import API from '../api.js';
import { Coffee, Home, PenTool, LayoutGrid } from 'lucide-react';

const StudentDash = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const fetchAllResources = async () => {
    try {
      setLoading(true);
      // Fetch from all three specific collections
      const [canteenRes, hostelRes, stationeryRes] = await Promise.all([
        API.get('/resource/canteen/all'),
        API.get('/resource/hostel/all'),
        API.get('/resource/stationery/all')
      ]);

      // Standardize data for student view
      const canteenData = canteenRes.data.map(item => ({ 
        ...item, type: 'Canteen', title: item.itemName, icon: <Coffee size={18}/> 
      }));
      const hostelData = hostelRes.data.map(item => ({ 
        ...item, type: 'Hostel', title: `Room ${item.roomNumber}`, icon: <Home size={18}/> 
      }));
      const stationeryData = stationeryRes.data.map(item => ({ 
        ...item, type: 'Stationery', title: item.itemName, icon: <PenTool size={18}/> 
      }));

      setItems([...canteenData, ...hostelData, ...stationeryData]);
    } catch (err) {
      console.error("Error fetching items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResources();
  }, []);

  const filteredItems = activeTab === 'All' 
    ? items 
    : items.filter(item => item.type === activeTab);

  if (loading) return <div className="text-center p-20 font-bold text-indigo-600">Syncing Resources...</div>;

  return (
    <div className="p-4 md:p-8 bg-[#f0f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 mb-2">Campus Resources</h1>
          <p className="text-slate-500">Check real-time availability of canteen, rooms, and supplies</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['All', 'Canteen', 'Hostel', 'Stationery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-slate-500 hover:bg-indigo-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                    {item.icon || <LayoutGrid size={18}/>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    (item.status === 'Available' || item.status === 'In Stock') 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-rose-50 text-rose-600'
                  }`}>
                    {item.status || (item.quantity > 0 ? 'Available' : 'Out of Stock')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-4">
                  {item.type} • {item.category || item.brand || 'General'}
                </p>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-lg font-black text-slate-700">
                    {item.price ? `₹${item.price}` : 'Free Access'}
                  </span>
                  {item.quantity !== undefined && (
                    <span className="text-xs text-slate-400 font-medium">
                      {item.quantity} units left
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No items available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDash;