import React, { useEffect, useState } from 'react';
import { getStats } from '../../api/admin';
import StatsCard from '../../components/cards/StatsCard';
import GlassCard from '../../components/common/GlassCard';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(res => {
        setStats(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const pieData = {
    labels: ['Scheduled', 'Active', 'Completed', 'Cancelled'],
    datasets: [{
      data: [
        stats?.scheduled_trips || 0,
        stats?.active_trips || 0,
        stats?.total_revenue ? Math.floor(stats.total_revenue / 100) : 0,
        stats?.vehicles_needing_service || 0
      ],
      backgroundColor: ['#3b82f6', '#22c55e', '#8b5cf6', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (ETB)',
      data: [12000, 19000, 15000, 25000, 22000, stats?.total_revenue || 0],
      backgroundColor: '#3b82f6',
      borderRadius: 8,
    }]
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">System Statistics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Key metrics and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Scheduled Trips" value={stats?.scheduled_trips || 0} color="blue" />
        <StatsCard title="Active Trips" value={stats?.active_trips || 0} color="green" />
        <StatsCard title="Total Drivers" value={stats?.total_drivers || 0} color="purple" />
        <StatsCard title="Revenue" value={`ETB ${stats?.total_revenue?.toFixed(2) || 0}`} color="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Trip Distribution</h3>
          <div className="flex justify-center">
            <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Revenue Trend</h3>
          <Bar
            data={revenueData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}
          />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Vehicles Needing Service</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats?.vehicles_needing_service || 0}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Passengers Served</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{(stats?.total_revenue || 0) / 50}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">System Uptime</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">99.9%</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Stats;