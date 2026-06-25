import React, { useState, useEffect } from 'react';
import { createOrder } from '../../api/freight';
import { getCities } from '../../api/admin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';

const CreateOrder = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    pickup_city_id: '',
    dropoff_city_id: '',
    weight_kg: '',
    volume_cbm: ''
  });

  useEffect(() => {
    getCities().then(res => { setCities(res.data.data); setLoading(false); }).catch(() => { toast.error('Failed to fetch cities'); setLoading(false); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder({
        ...formData,
        weight_kg: parseFloat(formData.weight_kg),
        volume_cbm: parseFloat(formData.volume_cbm) || null
      });
      toast.success('Freight order created');
      navigate('/freight/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create order');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create Freight Order</h1>
      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pickup City</label>
            <select value={formData.pickup_city_id} onChange={(e) => setFormData({...formData, pickup_city_id: e.target.value})} className="input-field" required>
              <option value="">Select City</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dropoff City</label>
            <select value={formData.dropoff_city_id} onChange={(e) => setFormData({...formData, dropoff_city_id: e.target.value})} className="input-field" required>
              <option value="">Select City</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
            <input type="number" step="0.01" value={formData.weight_kg} onChange={(e) => setFormData({...formData, weight_kg: e.target.value})} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Volume (m³)</label>
            <input type="number" step="0.01" value={formData.volume_cbm} onChange={(e) => setFormData({...formData, volume_cbm: e.target.value})} className="input-field" placeholder="Optional" />
          </div>
          <div className="flex gap-3">
            <GradientButton type="submit" variant="primary" className="flex-1">Create Order</GradientButton>
            <GradientButton variant="secondary" className="flex-1" onClick={() => navigate('/freight/orders')}>Cancel</GradientButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default CreateOrder;