import React, { useState, useEffect } from 'react';
import { getTrips } from '../../api/trips';
import { createBooking } from '../../api/bookings';
import { getRoutes } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const BookTrip = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [seatNumber, setSeatNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [filters, setFilters] = useState({ route_id: '', date: '' });

  useEffect(() => { fetchData(); }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsRes, routesRes] = await Promise.all([
        getTrips({ ...filters, status: 'scheduled' }),
        getRoutes()
      ]);
      setTrips(tripsRes.data.data);
      setRoutes(routesRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch trips');
    } finally { setLoading(false); }
  };

  const handleBooking = async (tripId) => {
    if (!seatNumber) { toast.error('Please select a seat'); return; }
    try {
      await createBooking({ trip_id: tripId, seat_number: seatNumber, payment_method: paymentMethod });
      toast.success('Booking confirmed!');
      setSelectedTrip(null);
      setSeatNumber('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Book a Trip</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Find and book available seats</p>
      </div>

      <GlassCard className="p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Route</label>
          <select value={filters.route_id} onChange={(e) => setFilters({...filters, route_id: e.target.value})} className="input-field">
            <option value="">All Routes</option>
            {routes.map(r => <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
          <input type="date" value={filters.date} onChange={(e) => setFilters({...filters, date: e.target.value})} className="input-field" />
        </div>
        <GradientButton variant="primary" icon={MagnifyingGlassIcon} onClick={fetchData}>Search</GradientButton>
      </GlassCard>

      <div className="space-y-4">
        {trips.length === 0 ? (
          <GlassCard className="p-8 text-center text-slate-500 dark:text-slate-400">No trips available</GlassCard>
        ) : (
          trips.map(trip => (
            <GlassCard key={trip.id} className="p-4 flex flex-wrap justify-between items-center" interactive hoverEffect="lift">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{trip.origin} → {trip.destination}</h3>
                <p className="text-sm text-slate-500">{new Date(trip.scheduled_departure).toLocaleString()}</p>
                <p className="text-sm text-slate-500">Driver: {trip.driver_name} · Plate: {trip.plate_number}</p>
              </div>
              <GradientButton variant="primary" size="sm" onClick={() => setSelectedTrip(trip.id)}>Select Seat</GradientButton>
            </GlassCard>
          ))
        )}
      </div>

      {selectedTrip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Book Your Seat</h2>
            <div className="space-y-3">
              <input placeholder="Seat Number (e.g., A12)" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} className="input-field" />
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
                <option value="wallet">Wallet</option>
                <option value="telebirr">Telebirr</option>
                <option value="cbebirr">CBEBirr</option>
              </select>
              <p className="text-sm text-slate-500">Balance: ETB {user?.wallet_balance?.toFixed(2) || 0}</p>
            </div>
            <div className="flex gap-3 mt-4">
              <GradientButton variant="primary" className="flex-1" onClick={() => handleBooking(selectedTrip)}>Confirm</GradientButton>
              <GradientButton variant="secondary" className="flex-1" onClick={() => { setSelectedTrip(null); setSeatNumber(''); }}>Cancel</GradientButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default BookTrip;