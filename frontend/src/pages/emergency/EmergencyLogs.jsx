import React, { useState, useEffect } from 'react';
import { getEmergencyLogs } from '../../api/emergency';
import GlassCard from '../../components/common/GlassCard';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const EmergencyLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmergencyLogs().then(res => { setLogs(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Emergency Logs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Record of all SOS events</p>
      </div>

      {logs.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-500">No emergency logs</GlassCard>
      ) : (
        <GlassCard className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Passengers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Reassigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-sm">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className="badge badge-danger">{log.emergency_type}</span></td>
                  <td className="px-4 py-3">{log.passenger_count}</td>
                  <td className="px-4 py-3">{log.new_driver_id ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{log.resolved_at ? 'Resolved' : 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
};

export default EmergencyLogs;