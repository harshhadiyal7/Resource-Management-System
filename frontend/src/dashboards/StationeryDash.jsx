import React, { useState, useEffect } from 'react';
import API from '../api';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

const StationeryDash = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ itemName: '', brand: '', price: '', quantity: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await API.get('/resource/stationery/all');
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: Number(formData.price), quantity: Number(formData.quantity) };
      if (editingId) {
        await API.put(`/resource/stationery/update/${editingId}`, payload);
      } else {
        await API.post('/resource/stationery/add', payload);
      }
      setFormData({ itemName: '', brand: '', price: '', quantity: '' });
      setIsDialogOpen(false);
      setEditingId(null);
      fetchItems();
    } catch (err) {
      alert("Error saving item. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Package size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Stationery Inventory</h1>
          </div>
          <button 
            onClick={() => { setIsDialogOpen(true); setEditingId(null); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
          >
            <Plus size={18} /> Add New Item
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Item Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Brand</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stock</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map(item => (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.itemName}</td>
                  <td className="px-6 py-4 text-slate-600">{item.brand}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.quantity > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">₹{item.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => { setEditingId(item._id); setFormData(item); setIsDialogOpen(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button onClick={async () => { if(window.confirm("Delete?")) { await API.delete(`/resource/stationery/delete/${item._id}`); fetchItems(); }}} className="text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Modal */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-6">{editingId ? 'Update Stationery' : 'Add Stationery'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full p-3 border rounded-xl" placeholder="Item Name" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} required />
                <input className="w-full p-3 border rounded-xl" placeholder="Brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" className="p-3 border rounded-xl" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  <input type="number" className="p-3 border rounded-xl" placeholder="Quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Save Item</button>
                  <button type="button" onClick={() => setIsDialogOpen(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationeryDash;