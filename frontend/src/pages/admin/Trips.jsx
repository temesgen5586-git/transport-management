import React, { useState, useEffect } from 'react';
import { getTrips, scheduleTrip } from '../../api/trips';
import { getRoutes, getVehicles, getUsers } from '../../api/admin';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    route_id: '',
    vehicle_id: '',
    driver_id: '',
    scheduled_departure: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsRes, routesRes, vehiclesRes, driversRes] = await Promise.all([
        getTrips(),
        getRoutes(),
        getVehicles(),
        getUsers('driver')
      ]);
      setTrips(tripsRes.data.data);
      setRoutes(routesRes.data.data);
      setVehicles(vehiclesRes.data.data);
      setDrivers(driversRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await scheduleTrip(formData);
      toast.success('Trip scheduled successfully');
      setShowForm(false);
      setFormData({ route_id: '', vehicle_id: '', driver_id: '', scheduled_departure: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to schedule trip');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'badge-info',
      boarding: 'badge-warning',
      departed: 'badge-warning',
      en_route: 'badge-warning',
      emergency: 'badge-danger',
      completed: 'badge-success',
      cancelled: 'badge-gray'
    };
    return `badge ${styles[status] || 'badge-gray'}`;
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Trip Scheduling</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Schedule and manage all trips</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Schedule Trip'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Route *</label>
              <select
                value={formData.route_id}
                onChange={(e) => setFormData({...formData, route_id: e.target.value})}
                className="input-field"
                required
              >
                <option value="">Select Route</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle *</label>
              <select
                value={formData.vehicle_id}
                onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
                className="input-field"
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate_number} ({v.vehicle_type})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Driver *</label>
              <select
                value={formData.driver_id}
                onChange={(e) => setFormData({...formData, driver_id: e.target.value})}
                className="input-field"
                required
              >
                <option value="">Select Driver</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Departure Time *</label>
              <input
                type="datetime-local"
                value={formData.scheduled_departure}
                onChange={(e) => setFormData({...formData, scheduled_departure: e.target.value})}
                className="input-field"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Must be between 12:00 AM and 2:00 PM Ethiopian time</p>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full mt-4">Schedule Trip</button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Departure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 text-slate-800 dark:text-slate-100">{trip.origin} → {trip.destination}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{trip.plate_number}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{trip.driver_name}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {new Date(trip.scheduled_departure).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(trip.status)}>{trip.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;