import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getManifest } from '../../api/driver';
import { getSettlements } from '../../api/driver';
import { getBalance } from '../../api/wallet';
import { getDriverPenalties } from '../../api/driver';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import {
  CalendarIcon,
  TruckIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const DriverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [todayTrips, setTodayTrips] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [balance, setBalance] = useState(0);
  const [penalties, setPenalties] = useState([]);
  const [stats, setStats] = useState({
    todayTrips: 0,
    completedThisMonth: 0,
    totalEarnings: 0,
    pendingPayout: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [manifestRes, settlementsRes, balanceRes, penaltiesRes] = await Promise.all([
        getManifest(),
        getSettlements(),
        getBalance(),
        getDriverPenalties().catch(() => ({ data: { data: [] } })),
      ]);

      const trips = manifestRes.data.data || [];
      const settlementsData = settlementsRes.data.data || [];
      const penaltiesData = penaltiesRes.data.data || [];

      setTodayTrips(trips);
      setSettlements(settlementsData);
      setPenalties(penaltiesData);
      setBalance(balanceRes.data.data.balance || 0);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayTripsCount = trips.filter(t => 
        new Date(t.scheduled_departure).toISOString().split('T')[0] === today
      ).length;

      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const completedThisMonth = settlementsData.filter(s => {
        const date = new Date(s.settled_at);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear && s.payout_status === 'completed';
      }).length;

      const totalEarnings = settlementsData
        .filter(s => s.payout_status === 'completed')
        .reduce((sum, s) => sum + parseFloat(s.final_payout || 0), 0);

      const pendingPayout = settlementsData
        .filter(s => s.payout_status === 'pending' || s.payout_status === 'processing')
        .reduce((sum, s) => sum + parseFloat(s.final_payout || 0), 0);

      setStats({
        todayTrips: todayTripsCount,
        completedThisMonth,
        totalEarnings,
        pendingPayout,
      });

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

  const currentAssignment = todayTrips.find(t => t.status === 'scheduled' || t.status === 'boarding');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Driver Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
            🟢 Online
          </span>
        </div>
      </div>

      {/* Greeting Card */}
      <GlassCard className="p-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        <h2 className="text-2xl font-bold">
          {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Driver'}
        </h2>
        <p className="text-blue-100 mt-1">
          You have {stats.todayTrips} trip{stats.todayTrips !== 1 ? 's' : ''} assigned today. Stay safe on the road.
        </p>
      </GlassCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Today's Trips", value: stats.todayTrips, icon: TruckIcon, color: 'blue' },
          { title: 'Completed This Month', value: stats.completedThisMonth, icon: CheckCircleIcon, color: 'emerald' },
          { title: 'Available Earnings', value: formatCurrency(balance), icon: CurrencyDollarIcon, color: 'emerald' },
          { title: 'Pending Payout', value: formatCurrency(stats.pendingPayout), icon: CalendarIcon, color: 'amber' },
        ].map((stat, idx) => (
          <GlassCard key={idx} className="p-5" interactive hoverEffect="lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Assignment & Penalties */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Assignment */}
          <GlassCard className="p-6" interactive>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Current Assignment</h3>
              <Link to="/driver/manifest" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                View All <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {currentAssignment ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      {currentAssignment.origin} → {currentAssignment.destination}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(currentAssignment.scheduled_departure)}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        {currentAssignment.passenger_count || 0} / {currentAssignment.max_capacity || '?'} passengers
                      </span>
                      <span className="flex items-center gap-1">
                        <TruckIcon className="w-4 h-4" />
                        {currentAssignment.plate_number}
                      </span>
                    </div>
                  </div>
                  <GradientButton 
                    size="sm" 
                    onClick={() => navigate(`/driver/manifest`)}
                  >
                    {currentAssignment.status === 'scheduled' ? 'GPS Required on Depart' : 'View Trip'}
                  </GradientButton>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No active assignments</p>
                <p className="text-sm mt-1">Check back later for new trips</p>
              </div>
            )}
          </GlassCard>

          {/* Settlement History */}
          <GlassCard className="p-6" interactive>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Settlement History</h3>
              <Link to="/driver/settlements" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                View history <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Trip</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Gross</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Penalty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Net</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {settlements.slice(0, 5).map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{s.trip_id?.slice(0, 12) || 'Trip'}</td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{formatDate(s.settled_at)}</td>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{parseFloat(s.gross_earning || 0).toFixed(2)}</td>
                      <td className="px-4 py-2 text-rose-600 dark:text-rose-400">
                        {s.penalty_deductions && parseFloat(s.penalty_deductions) > 0 ? `-${parseFloat(s.penalty_deductions).toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-100">
                        {parseFloat(s.final_payout || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`badge ${s.payout_status === 'completed' ? 'badge-success' : s.payout_status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                          {s.payout_status === 'completed' ? 'Paid' : s.payout_status === 'pending' ? 'Pending' : 'Processing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {settlements.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center text-slate-500">No settlements yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Penalties & Actions */}
        <div className="space-y-6">
          {/* Recent Penalties */}
          <GlassCard className="p-6" interactive>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Recent Penalties</h3>
              <Link to="/driver/penalties" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                View all <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {penalties.slice(0, 3).length > 0 ? (
              <div className="space-y-3">
                {penalties.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{p.description || p.penalty_type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(p.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-rose-600 dark:text-rose-400 font-medium">-ETB {parseFloat(p.amount || 0).toFixed(2)}</p>
                      <span className={`badge ${p.is_paid ? 'badge-success' : 'badge-warning'} text-xs`}>
                        {p.is_paid ? 'Settled' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                <p>No penalties</p>
                <p className="text-sm">Clean record! 🎉</p>
              </div>
            )}
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="p-6" interactive>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: "📋 Today's Manifest", path: '/driver/manifest' },
                { label: '💰 View Settlements', path: '/driver/settlements' },
                { label: '⚖️ View Penalties', path: '/driver/penalties' },
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group"
                >
                  <span className="text-slate-700 dark:text-slate-300">{action.label}</span>
                  <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Request Payout Button */}
          <GradientButton 
            variant="success" 
            size="lg" 
            onClick={() => navigate('/driver/settlements')}
            className="w-full"
          >
            💰 Request Payout
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;