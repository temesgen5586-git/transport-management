import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBookings } from '../../api/bookings';
import { getBalance } from '../../api/wallet';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import {
  WalletIcon,
  CalendarIcon,
  TruckIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  PlusIcon,
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [balanceRes, bookingsRes] = await Promise.all([
        getBalance(),
        getBookings(),
      ]);

      setBalance(balanceRes.data.data.balance || 0);

      const allBookings = bookingsRes.data.data || [];
      setBookings(allBookings);

      const now = new Date();
      const upcoming = allBookings
        .filter(b => {
          const depDate = new Date(b.scheduled_departure);
          return depDate > now && b.booking_status === 'confirmed';
        })
        .sort((a, b) => new Date(a.scheduled_departure) - new Date(b.scheduled_departure))
        .slice(0, 3);

      setUpcomingTrips(upcoming);
      setUpcomingCount(upcoming.length);

      const recent = allBookings
        .filter(b => b.booking_status !== 'cancelled')
        .sort((a, b) => new Date(b.scheduled_departure) - new Date(a.scheduled_departure))
        .slice(0, 5);

      setRecentBookings(recent);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `ETB ${parseFloat(amount || 0).toLocaleString('en-ET', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'badge-success',
      checked_in: 'badge-info',
      cancelled: 'badge-danger',
      no_show: 'badge-gray',
      completed: 'badge-success',
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
            🟢 Online
          </span>
        </div>
      </div>

      {/* Welcome */}
      <GlassCard className="p-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</h2>
        <p className="text-blue-100 mt-1">
          You have {upcomingCount} upcoming trip{upcomingCount !== 1 ? 's' : ''} this week.
        </p>
      </GlassCard>

      {/* Wallet & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <GlassCard className="lg:col-span-1 p-6" interactive hoverEffect="lift">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">My Wallet</h3>
            <Link to="/wallet" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
              View History <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <WalletIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Balance</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-slate-400 mt-1">Available to spend</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <GradientButton
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => navigate('/wallet')}
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Add Funds
            </GradientButton>
            <GradientButton
              variant="warning"
              size="sm"
              className="flex-1"
              onClick={() => toast.info('Transfer feature coming soon')}
            >
              <ArrowPathIcon className="w-4 h-4 mr-1" /> Transfer
            </GradientButton>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="lg:col-span-2 p-6" interactive>
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Book a Trip', icon: TicketIcon, path: '/book-trip', color: 'blue' },
              { label: 'My Bookings', icon: CalendarIcon, path: '/my-bookings', color: 'emerald' },
              { label: 'Add Funds', icon: PlusIcon, path: '/wallet', color: 'amber' },
              { label: 'Freight Order', icon: TruckIcon, path: '/freight/create', color: 'purple' },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className={`flex flex-col items-center justify-center p-4 bg-${action.color}-50 dark:bg-${action.color}-900/20 rounded-xl hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/40 transition-all group`}
              >
                <action.icon className={`w-8 h-8 text-${action.color}-600 dark:text-${action.color}-400 mb-2 group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Upcoming Trips */}
      <GlassCard className="p-6" interactive>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Upcoming Trips</h3>
          <Link to="/my-bookings" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
            View All <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {upcomingTrips.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No upcoming trips</p>
            <p className="text-sm mt-1">Book a trip to get started! 🎫</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{trip.origin}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{trip.destination}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {formatDate(trip.scheduled_departure)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {formatTime(trip.scheduled_departure)}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3" />
                        Seat {trip.seat_number}
                      </span>
                      <span className="flex items-center gap-1">
                        <TruckIcon className="w-3 h-3" />
                        {trip.plate_number || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${trip.booking_status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                    {trip.booking_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Recent Bookings Table */}
      <GlassCard className="p-6" interactive>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Recent Bookings</h3>
          <Link to="/my-bookings" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
            View All <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Route</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Seat</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Fare (ETB)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-slate-500">No bookings yet</td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                      {booking.origin} → {booking.destination}
                    </td>
                    <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                      {formatDate(booking.scheduled_departure)}
                    </td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">
                      {booking.seat_number}
                    </td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                      {parseFloat(booking.price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <span className={getStatusBadge(booking.booking_status)}>
                        {booking.booking_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default CustomerDashboard;