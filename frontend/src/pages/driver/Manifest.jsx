import React, { useState, useEffect } from 'react';
import { getManifest } from '../../api/driver';
import { departTrip, completeTrip } from '../../api/trips';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';

const Manifest = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showDepartModal, setShowDepartModal] = useState(null);
  const [gpsCoords, setGpsCoords] = useState({ latitude: '', longitude: '' });

  useEffect(() => { fetchManifest(); }, []);

  const fetchManifest = async () => {
    try {
      setLoading(true);
      const res = await getManifest();
      setTrips(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch manifest');
    } finally { setLoading(false); }
  };

  const handleDepart = async (tripId) => {
    if (!gpsCoords.latitude || !gpsCoords.longitude) { toast.error('GPS required'); return; }
    try {
      setActionLoading(tripId);
      await departTrip(tripId, gpsCoords);
      toast.success('Departed');
      setShowDepartModal(null);
      setGpsCoords({ latitude: '', longitude: '' });
      fetchManifest();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to depart');
    } finally { setActionLoading(null); }
  };

  const handleComplete = async (tripId) => {
    if (!window.confirm('Complete this trip?')) return;
    try {
      setActionLoading(tripId);
      await completeTrip(tripId);
      toast.success('Completed');
      fetchManifest();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete');
    } finally { setActionLoading(null); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Today's Manifest</h1>
        <p className="text-sm text-slate-500">Driver: {user?.full_name}</p>
      </div>

      {trips.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-500">No trips assigned</GlassCard>
      ) : (
        trips.map(trip => (
          <GlassCard key={trip.trip_id} className="p-4 flex flex-wrap justify-between items-center" interactive>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{trip.origin} → {trip.destination}</h3>
              <p className="text-sm text-slate-500">Departure: {new Date(trip.scheduled_departure).toLocaleString()}</p>
              <p className="text-sm text-slate-500">Passengers: {trip.passenger_count} · Plate: {trip.plate_number}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${trip.status === 'scheduled' ? 'badge-warning' : trip.status === 'departed' ? 'badge-info' : 'badge-success'}`}>{trip.status}</span>
              {trip.status === 'scheduled' && (
                <GradientButton variant="primary" size="sm" onClick={() => setShowDepartModal(trip.trip_id)}>Depart</GradientButton>
              )}
              {trip.status === 'departed' && (
                <GradientButton variant="success" size="sm" onClick={() => handleComplete(trip.trip_id)}>Complete</GradientButton>
              )}
            </div>
          </GlassCard>
        ))
      )}

      {showDepartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Departure</h2>
            <div className="space-y-3">
              <input type="number" step="any" placeholder="Latitude" value={gpsCoords.latitude} onChange={(e) => setGpsCoords({...gpsCoords, latitude: e.target.value})} className="input-field" />
              <input type="number" step="any" placeholder="Longitude" value={gpsCoords.longitude} onChange={(e) => setGpsCoords({...gpsCoords, longitude: e.target.value})} className="input-field" />
            </div>
            <div className="flex gap-3 mt-4">
              <GradientButton variant="primary" className="flex-1" onClick={() => handleDepart(showDepartModal)}>Depart</GradientButton>
              <GradientButton variant="secondary" className="flex-1" onClick={() => { setShowDepartModal(null); setGpsCoords({ latitude: '', longitude: '' }); }}>Cancel</GradientButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Manifest;