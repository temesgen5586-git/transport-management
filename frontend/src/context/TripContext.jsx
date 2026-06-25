import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTrips, getLiveTrips } from '../api/trips';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [liveTrips, setLiveTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async (params = {}) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await getTrips(params);
      const trips = res.data.data || [];
      setAllTrips(trips);

      const now = new Date();
      const upcoming = trips
        .filter(t => new Date(t.scheduled_departure) > now && t.status === 'scheduled')
        .sort((a, b) => new Date(a.scheduled_departure) - new Date(b.scheduled_departure));
      setUpcomingTrips(upcoming);
    } catch (error) {
      toast.error('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveTrips = async () => {
    try {
      const res = await getLiveTrips();
      setLiveTrips(res.data.data || []);
    } catch (error) {
      // Silent fail
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
      fetchLiveTrips();
      const interval = setInterval(fetchLiveTrips, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const refreshTrips = () => {
    fetchTrips();
    fetchLiveTrips();
  };

  return (
    <TripContext.Provider
      value={{
        upcomingTrips,
        liveTrips,
        allTrips,
        loading,
        fetchTrips,
        fetchLiveTrips,
        refreshTrips,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};