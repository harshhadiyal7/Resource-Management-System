import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import { 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  Coffee, 
  UtensilsCrossed, 
  AlertCircle,
  Search
} from 'lucide-react';

const CanteenDashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    itemName: '', 
    quantity: '', 
    price: '', 
    category: '' 
  });

  const loadData = async () => {
    try {
      const res = await API.get('/resource/canteen/all'); // Updated to your new specific route
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      itemName: formData.itemName,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      category: formData.category || 'canteen'
    };

    try {
      if (editingId) {
        await API.put(`/resource/canteen/update/${editingId}`, payload);
      } else {
        await API.post('/resource/canteen/add', payload);
      }
      loadData();
      setIsDialogOpen(false);
      setEditingId(null);
    } catch (err) {
      alert("Submission failed. Check your network or permissions.");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name} from menu?`)) {
      try {
        await API.delete(`/resource/canteen/delete/${id}`);
        loadData();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      itemName: item.itemName,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
    });
    setIsDialogOpen(true);
  };

  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <Coffee size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Canteen Management</h1>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-semibold transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600"><UtensilsCrossed size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Items</p>
              <p className="text-2xl font-black text-slate-800">{items.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-rose-50 p-4 rounded-xl text-rose-600"><AlertCircle size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Low Stock</p>
              <p className="text-2xl font-black text-slate-800">{items.filter(i => i.quantity < 5).length}</p>
            </div>
          </div>
          <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg flex items-center justify-between text-white">
            <div>
              <p className="text-indigo-100 font-bold uppercase tracking-wider text-sm">Add New Resource</p>
              <p className="text-lg opacity-80">Update Daily Menu</p>
            </div>
            <button 
              onClick={() => { setEditingId(null); setFormData({itemName:'', quantity:'', price:'', category:''}); setIsDialogOpen(true); }}
              className="bg-white text-indigo-600 p-3 rounded-xl hover:scale-105 transition-transform shadow-md"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Search and Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">Inventory Status</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search food items..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-500 uppercase text-[11px] font-black tracking-widest">
                  <th className="py-4 px-6">Food Item</th>
                  <th className="py-4 px-6 text-center">Category</th>
                  <th className="py-4 px-6 text-center">Stock Level</th>
                  <th className="py-4 px-6 text-center">Price</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 text-lg">{item.itemName}</p>
                      <p className="text-xs text-slate-400">UID: {item._id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tighter">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        item.quantity > 5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${item.quantity > 5 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                        {item.quantity} Units
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700 text-lg">₹{item.price}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil size={18}/></button>
                        <button onClick={() => handleDelete(item._id, item.itemName)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modern Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                {editingId ? <Pencil className="text-indigo-600" /> : <Plus className="text-emerald-600" />}
                {editingId ? 'Edit Resource' : 'New Resource'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                  <input className="w-full border-2 border-slate-100 bg-slate-50 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-semibold" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <input className="w-full border-2 border-slate-100 bg-slate-50 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-semibold" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g., Snacks" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                    <input type="number" className="w-full border-2 border-slate-100 bg-slate-50 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-semibold" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                    <input type="number" step="0.01" className="w-full border-2 border-slate-100 bg-slate-50 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-semibold" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button type="submit" className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Changes</button>
                  <button type="button" onClick={() => setIsDialogOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanteenDashboard;