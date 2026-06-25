import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStats, getVehicles, getFleetCapacity } from '../../api/admin';
import { getTrips } from '../../api/trips';
import { getAuditLogs } from '../../api/audit';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import StatsCard from '../../components/cards/StatsCard';
import {
  CalendarIcon,
  TruckIcon,
  UsersIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  PlusIcon,
  ClockIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [fleetSummary, setFleetSummary] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        statsRes,
        vehiclesRes,
        tripsRes,
        auditRes,
        fleetRes,
      ] = await Promise.all([
        getStats(),
        getVehicles(),
        getTrips({ limit: 10 }),
        getAuditLogs({ limit: 6 }).catch(() => ({ data: { data: [] } })),
        getFleetCapacity().catch(() => ({ data: { data: {} } })),
      ]);

      setStats(statsRes.data.data);
      setVehicles(vehiclesRes.data.data || []);
      setTrips(tripsRes.data.data || []);
      setRecentActivity(auditRes.data.data || []);
      setFleetSummary(fleetRes.data.data || {});
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `ETB ${parseFloat(amount || 0).toLocaleString('en-ET', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'badge-info',
      boarding: 'badge-warning',
      departed: 'badge-warning',
      en_route: 'badge-warning',
      emergency: 'badge-danger',
      completed: 'badge-success',
      cancelled: 'badge-gray',
    };
    return `badge ${styles[status] || 'badge-gray'}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Recent activity formatter
  const getActivityIcon = (actionType) => {
    if (actionType.includes('USER_REGISTERED')) return <UserCircleIcon className="w-4 h-4" />;
    if (actionType.includes('TRIP_SCHEDULED')) return <CalendarIcon className="w-4 h-4" />;
    if (actionType.includes('PENALTY')) return <ExclamationTriangleIcon className="w-4 h-4" />;
    if (actionType.includes('EMERGENCY')) return <ExclamationTriangleIcon className="w-4 h-4" />;
    if (actionType.includes('DEPOSIT') || actionType.includes('PAYMENT')) return <CurrencyDollarIcon className="w-4 h-4" />;
    if (actionType.includes('FREIGHT')) return <DocumentTextIcon className="w-4 h-4" />;
    return <ClockIcon className="w-4 h-4" />;
  };

  const getActivityColor = (actionType) => {
    if (actionType.includes('USER_REGISTERED')) return 'text-emerald-500';
    if (actionType.includes('TRIP_SCHEDULED')) return 'text-blue-500';
    if (actionType.includes('PENALTY')) return 'text-rose-500';
    if (actionType.includes('EMERGENCY')) return 'text-red-500';
    if (actionType.includes('DEPOSIT') || actionType.includes('PAYMENT')) return 'text-emerald-500';
    if (actionType.includes('FREIGHT')) return 'text-purple-500';
    return 'text-slate-500';
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

      {/* Greeting */}
      <GlassCard className="p-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        <h2 className="text-2xl font-bold">
          {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Admin'}
        </h2>
        <p className="text-blue-100 mt-1">
          Here's what's happening across your transport network today.
        </p>
      </GlassCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Scheduled Trips"
          value={stats?.scheduled_trips || 0}
          color="blue"
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Active Trips"
          value={stats?.active_trips || 0}
          color="green"
          trend="up"
          trendValue="+5%"
        />
        <StatsCard
          title="Total Drivers"
          value={stats?.total_drivers || 0}
          color="purple"
          trend="down"
          trendValue="-2%"
        />
        <StatsCard
          title="Revenue Today"
          value={formatCurrency(stats?.total_revenue || 0)}
          color="gold"
          trend="up"
          trendValue="+18%"
        />
      </div>

      {/* Additional Stats - Cities, Vehicles, Vehicle Types */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5" interactive hoverEffect="lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cities</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {stats?.total_cities || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <MapPinIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" interactive hoverEffect="lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Vehicles</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {fleetSummary?.total_vehicles || vehicles.length || 0}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <TruckIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" interactive hoverEffect="lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Vehicle Types</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {stats?.total_vehicle_types || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Cog6ToothIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Fleet Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Overview */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6" interactive>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Fleet Overview</h3>
              <Link to="/admin/vehicles" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                View All <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No vehicles registered</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicles.slice(0, 2).map((vehicle) => {
                  const current = vehicle.current_occupancy || 0;
                  const max = vehicle.max_capacity || 0;
                  const percentage = max > 0 ? (current / max) * 100 : 0;
                  const isFull = current >= max;
                  return (
                    <div
                      key={vehicle.id}
                      className={`p-4 rounded-xl border ${isFull ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-700/30`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100">{vehicle.plate_number}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{vehicle.vehicle_type}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-medium ${isFull ? 'text-red-500' : 'text-emerald-500'}`}>
                            {isFull ? 'Full' : `${Math.round(percentage)}%`}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Occupancy: {current}/{max} seats</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => navigate(`/admin/vehicles`)}
                          className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/admin/vehicles`)}
                          className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Adjust Capacity
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <GlassCard className="p-6" interactive>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group"
              >
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <PlusIcon className="w-4 h-4" /> Add User
                </span>
                <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
              </button>
              <button
                onClick={() => navigate('/admin/routes')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group"
              >
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <PlusIcon className="w-4 h-4" /> Add Route
                </span>
                <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
              </button>
              <button
                onClick={() => navigate('/admin/vehicles')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group"
              >
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <PlusIcon className="w-4 h-4" /> Register Vehicle
                </span>
                <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
              </button>
            </div>
          </GlassCard>

          {/* Analytics & Safety */}
          <GlassCard className="p-6" interactive>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4">Analytics & Safety</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Statistics', path: '/admin/stats', icon: ChartBarIcon },
                { label: 'Penalties', path: '/admin/penalties', icon: ExclamationTriangleIcon },
                { label: 'Emergency Logs', path: '/emergency/logs', icon: ExclamationTriangleIcon },
                { label: 'Freight Orders', path: '/freight/orders', icon: TruckIcon },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
                  >
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 mb-1" />
                    <span className="text-xs text-slate-600 dark:text-slate-300">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Today's Trips Table */}
      <GlassCard className="p-6" interactive>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Today's Trips</h3>
          <Link to="/admin/trips" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
            Manage trips <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Route</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Vehicle</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Driver</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Departure</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-slate-500">No trips scheduled today</td>
                </tr>
              ) : (
                trips.slice(0, 5).map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                      {trip.origin} → {trip.destination}
                    </td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{trip.plate_number}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{trip.driver_name}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{formatTime(trip.scheduled_departure)}</td>
                    <td className="px-4 py-2">
                      <span className={getStatusBadge(trip.status)}>{trip.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard className="p-6" interactive>
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                <div className={`p-2 bg-white dark:bg-slate-800 rounded-lg ${getActivityColor(log.action_type)}`}>
                  {getActivityIcon(log.action_type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 dark:text-slate-100 font-medium">
                    {log.action_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {log.entity_type} · {log.user_id?.slice(0, 8) || 'System'}
                  </p>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// Import ChartBarIcon for the analytics cards
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default AdminDashboard;