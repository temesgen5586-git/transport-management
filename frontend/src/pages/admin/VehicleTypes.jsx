import React, { useState, useEffect } from 'react';
import { getVehicleTypes, createVehicleType, updateVehicleType, deleteVehicleType } from '../../api/admin';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const VehicleTypes = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'bus',
    max_capacity: '',
    base_fare_multiplier: '1.0',
    freight_capacity_kg: ''
  });

  const categories = ['bus', 'minivan', 'sedan', 'truck'];

  useEffect(() => { fetchTypes(); }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await getVehicleTypes();
      setTypes(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch vehicle types');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        max_capacity: parseInt(formData.max_capacity),
        base_fare_multiplier: parseFloat(formData.base_fare_multiplier),
        freight_capacity_kg: formData.freight_capacity_kg ? parseFloat(formData.freight_capacity_kg) : null
      };
      if (editingType) {
        await updateVehicleType(editingType.id, data);
        toast.success('Vehicle type updated');
      } else {
        await createVehicleType(data);
        toast.success('Vehicle type created');
      }
      setShowModal(false);
      resetForm();
      fetchTypes();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'bus', max_capacity: '', base_fare_multiplier: '1.0', freight_capacity_kg: '' });
    setEditingType(null);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      category: type.category,
      max_capacity: type.max_capacity,
      base_fare_multiplier: type.base_fare_multiplier,
      freight_capacity_kg: type.freight_capacity_kg || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle type?')) return;
    try {
      await deleteVehicleType(id);
      toast.success('Vehicle type deleted');
      fetchTypes();
    } catch (error) {
      toast.error('Failed to delete vehicle type');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Vehicle Types</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Define vehicle categories and capacity defaults</p>
        </div>
        <GradientButton variant="primary" size="sm" icon={PlusIcon} onClick={() => { resetForm(); setShowModal(true); }}>
          Add Type
        </GradientButton>
      </div>

      {/* Vehicle Types Table */}
      <GlassCard className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Multiplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Freight Kg</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {types.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No vehicle types found
                </td>
              </tr>
            ) : (
              types.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{t.name}</td>
                  <td className="px-6 py-4">
                    <span className="badge badge-info">{t.category}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.max_capacity}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.base_fare_multiplier}x</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.freight_capacity_kg || '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {editingType ? 'Edit Vehicle Type' : 'Create Vehicle Type'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Type Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Economy Bus"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Max Capacity *
                  </label>
                  <input
                    type="number"
                    name="max_capacity"
                    value={formData.max_capacity}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Fare Multiplier *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="base_fare_multiplier"
                    value={formData.base_fare_multiplier}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="1.0"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Freight Capacity (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="freight_capacity_kg"
                    value={formData.freight_capacity_kg}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <GradientButton type="submit" variant="primary" className="flex-1">
                  {editingType ? 'Update Type' : 'Create Type'}
                </GradientButton>
                <GradientButton
                  type="button"
                  variant="secondary"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1"
                >
                  Cancel
                </GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default VehicleTypes;