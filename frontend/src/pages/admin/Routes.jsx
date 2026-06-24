import React, { useState, useEffect } from 'react';
import { getRoutes, createRoute, updateRoute, deleteRoute, getCities } from '../../api/admin';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    origin_city_id: '',
    destination_city_id: '',
    distance_km: '',
    base_duration_mins: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [routesRes, citiesRes] = await Promise.all([getRoutes(), getCities()]);
      setRoutes(routesRes.data.data);
      setCities(citiesRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        distance_km: parseFloat(formData.distance_km),
        base_duration_mins: parseInt(formData.base_duration_mins)
      };
      if (editingRoute) {
        await updateRoute(editingRoute.id, data);
        toast.success('Route updated');
      } else {
        await createRoute(data);
        toast.success('Route created');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({ origin_city_id: '', destination_city_id: '', distance_km: '', base_duration_mins: '' });
    setEditingRoute(null);
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      origin_city_id: route.origin_city_id,
      destination_city_id: route.destination_city_id,
      distance_km: route.distance_km,
      base_duration_mins: route.base_duration_mins
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this route?')) return;
    try {
      await deleteRoute(id);
      toast.success('Route deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete route');
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Routes Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage origin-destination routes</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Route
        </button>
      </div>

      {/* Search & Stats */}
      <div className="card p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
          <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {filteredRoutes.length} routes
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
            Active: {routes.filter(r => r.is_active !== false).length}
          </span>
        </div>
      </div>

      {/* Routes Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Origin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Distance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredRoutes.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No routes found. Click "Add Route" to create one.
                </td>
              </tr>
            ) : (
              filteredRoutes.map((route, index) => (
                <tr key={route.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{route.origin}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{route.destination}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{route.distance_km} km</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{route.base_duration_mins} min</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${route.is_active !== false ? 'badge-success' : 'badge-danger'}`}>
                      {route.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(route)}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {editingRoute ? 'Edit Route' : 'Add New Route'}
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
                    Origin City *
                  </label>
                  <select
                    value={formData.origin_city_id}
                    onChange={(e) => setFormData({...formData, origin_city_id: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Origin</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Destination City *
                  </label>
                  <select
                    value={formData.destination_city_id}
                    onChange={(e) => setFormData({...formData, destination_city_id: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Destination</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.distance_km}
                    onChange={(e) => setFormData({...formData, distance_km: e.target.value})}
                    className="input-field"
                    placeholder="550.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.base_duration_mins}
                    onChange={(e) => setFormData({...formData, base_duration_mins: e.target.value})}
                    className="input-field"
                    placeholder="480"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  {editingRoute ? 'Update Route' : 'Add Route'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;