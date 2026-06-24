import React, { useState, useEffect } from 'react';
import { getVehicles, registerVehicle, updateVehicle, deleteVehicle, getVehicleTypes, updateVehicleCapacity } from '../../api/admin';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [capacityValue, setCapacityValue] = useState('');
  const [formData, setFormData] = useState({
    plate_number: '',
    vehicle_type_id: '',
    model: '',
    year_made: '',
    max_capacity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehiclesRes, typesRes] = await Promise.all([getVehicles(), getVehicleTypes()]);
      setVehicles(vehiclesRes.data.data);
      setVehicleTypes(typesRes.data.data);
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
        year_made: parseInt(formData.year_made) || null,
        max_capacity: parseInt(formData.max_capacity) || null,
        vehicle_type_id: parseInt(formData.vehicle_type_id)
      };
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, data);
        toast.success('Vehicle updated');
      } else {
        await registerVehicle(data);
        toast.success('Vehicle registered');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({ plate_number: '', vehicle_type_id: '', model: '', year_made: '', max_capacity: '' });
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plate_number: vehicle.plate_number,
      vehicle_type_id: vehicle.vehicle_type_id,
      model: vehicle.model || '',
      year_made: vehicle.year_made || '',
      max_capacity: vehicle.max_capacity || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await deleteVehicle(id);
      toast.success('Vehicle deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete vehicle');
    }
  };

  const handleCapacityUpdate = async (id) => {
    try {
      await updateVehicleCapacity(id, { max_capacity: parseInt(capacityValue) });
      toast.success('Capacity updated');
      setShowCapacityModal(null);
      setCapacityValue('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update capacity');
    }
  };

  const getDefaultCapacity = (typeId) => {
    const type = vehicleTypes.find(t => t.id === parseInt(typeId));
    return type ? type.max_capacity : 0;
  };

  const getCapacityStatus = (vehicle) => {
    const current = vehicle.current_occupancy || 0;
    const max = vehicle.max_capacity || 0;
    const percentage = max > 0 ? (current / max) * 100 : 0;
    if (percentage >= 100) return { label: `Full (${current}/${max})`, color: 'badge-danger', bg: 'bg-red-500' };
    if (percentage >= 80) return { label: `Almost Full (${current}/${max})`, color: 'badge-warning', bg: 'bg-yellow-500' };
    if (percentage >= 50) return { label: `${current}/${max} Booked`, color: 'badge-info', bg: 'bg-blue-500' };
    if (percentage > 0) return { label: `${current}/${max} Booked`, color: 'badge-info', bg: 'bg-blue-300' };
    return { label: `${max} Available`, color: 'badge-success', bg: 'bg-emerald-500' };
  };

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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Vehicles Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage fleet vehicles with capacity tracking</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Register Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => {
          const status = getCapacityStatus(vehicle);
          const isFull = vehicle.current_occupancy >= vehicle.max_capacity;
          return (
            <div key={vehicle.id} className={`card p-4 hover:shadow-lg transition-all ${isFull ? 'border-red-300 dark:border-red-800' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{vehicle.plate_number}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{vehicle.vehicle_type}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{vehicle.model || 'N/A'} • {vehicle.year_made || 'N/A'}</p>
                </div>
                <span className={`badge ${status.color}`}>{status.label}</span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Capacity</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{vehicle.max_capacity || 0} seats</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${status.bg}`}
                    style={{ width: `${Math.min(((vehicle.current_occupancy || 0) / (vehicle.max_capacity || 1)) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Occupied: {vehicle.current_occupancy || 0}</span>
                  <span>Available: {Math.max(0, (vehicle.max_capacity || 0) - (vehicle.current_occupancy || 0))}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => { setShowCapacityModal(vehicle.id); setCapacityValue(vehicle.max_capacity || ''); }}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4" /> Adjust Capacity
                </button>
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="text-sm text-primary-600 hover:underline dark:text-primary-400 flex items-center gap-1"
                >
                  <PencilIcon className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-sm text-red-600 hover:underline dark:text-red-400 flex items-center gap-1"
                >
                  <TrashIcon className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {editingVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Plate Number *
                  </label>
                  <input
                    value={formData.plate_number}
                    onChange={(e) => setFormData({...formData, plate_number: e.target.value})}
                    className="input-field"
                    placeholder="AA-12345"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    value={formData.vehicle_type_id}
                    onChange={(e) => {
                      const typeId = e.target.value;
                      const defaultCap = getDefaultCapacity(typeId);
                      setFormData({...formData, vehicle_type_id: typeId, max_capacity: defaultCap || ''});
                    }}
                    className="input-field"
                    required
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} (Default: {v.max_capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Model
                  </label>
                  <input
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="input-field"
                    placeholder="Isuzu Bus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Year Made
                  </label>
                  <input
                    type="number"
                    value={formData.year_made}
                    onChange={(e) => setFormData({...formData, year_made: e.target.value})}
                    className="input-field"
                    placeholder="2022"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Max Capacity (override default)
                  </label>
                  <input
                    type="number"
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({...formData, max_capacity: e.target.value})}
                    className="input-field"
                    placeholder="Leave empty to use vehicle type default"
                  />
                  {formData.vehicle_type_id && (
                    <p className="text-xs text-slate-400 mt-1">
                      Default capacity: {getDefaultCapacity(formData.vehicle_type_id)} seats
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
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

      {/* Capacity Adjustment Modal */}
      {showCapacityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Adjust Vehicle Capacity</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Update the maximum number of passengers this vehicle can carry.
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Max Capacity (seats)
              </label>
              <input
                type="number"
                min="1"
                value={capacityValue}
                onChange={(e) => setCapacityValue(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleCapacityUpdate(showCapacityModal)}
                className="btn-primary flex-1"
              >
                Update
              </button>
              <button
                onClick={() => { setShowCapacityModal(null); setCapacityValue(''); }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;