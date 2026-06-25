import React, { useState, useEffect } from 'react';
import { getCities, createCity, updateCity, deleteCity } from '../../api/admin';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => { fetchCities(); }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await getCities();
      setCities(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch cities');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0
      };
      if (editingCity) {
        await updateCity(editingCity.id, data);
        toast.success('City updated successfully');
      } else {
        await createCity(data);
        toast.success('City created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCities();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', region: '', latitude: '', longitude: '' });
    setEditingCity(null);
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      region: city.region,
      latitude: city.latitude || '',
      longitude: city.longitude || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this city?')) return;
    try {
      await deleteCity(id);
      toast.success('City deleted successfully');
      fetchCities();
    } catch (error) {
      toast.error('Failed to delete city');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const filteredCities = cities.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Cities Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage Ethiopian cities and their coordinates</p>
        </div>
        <GradientButton variant="primary" size="sm" icon={PlusIcon} onClick={() => { resetForm(); setShowModal(true); }}>
          Add City
        </GradientButton>
      </div>

      {/* Search */}
      <GlassCard className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city name or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Total: {filteredCities.length} cities
        </span>
      </GlassCard>

      {/* Cities Table */}
      <GlassCard className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Region</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Coordinates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredCities.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No cities found
                </td>
              </tr>
            ) : (
              filteredCities.map((city) => (
                <tr key={city.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{city.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{city.region}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {city.latitude && city.longitude ? `${city.latitude}, ${city.longitude}` : 'Not set'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(city)}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(city.id)}
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
                {editingCity ? 'Edit City' : 'Add New City'}
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
                    City Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Addis Ababa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Region *
                  </label>
                  <input
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Addis Ababa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="9.032"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="38.746"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <GradientButton type="submit" variant="primary" className="flex-1">
                  {editingCity ? 'Update City' : 'Add City'}
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

export default Cities;