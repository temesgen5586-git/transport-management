import React, { useState, useEffect } from 'react';
import { getDriverPenalties } from '../../api/driver';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DriverPenalties = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverPenalties()
      .then(res => { setPenalties(res.data.data); setLoading(false); })
      .catch(() => { toast.error('Failed to fetch penalties'); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Penalties</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Record of fines and violations</p>
      </div>

      {penalties.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-500 dark:text-slate-400">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-emerald-400 mb-4" />
          <p>No penalties</p>
          <p className="text-sm">Clean record! 🎉</p>
        </GlassCard>
      ) : (
        penalties.map((p) => (
          <GlassCard key={p.id} className="p-4 flex justify-between items-center" interactive>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">{p.description || p.penalty_type}</p>
              <p className="text-sm text-slate-500">{new Date(p.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-bold">-ETB {parseFloat(p.amount).toFixed(2)}</p>
              <span className={`badge ${p.is_paid ? 'badge-success' : 'badge-danger'}`}>{p.is_paid ? 'Settled' : 'Pending'}</span>
            </div>
          </GlassCard>
        ))
      )}
    </div>
  );
};

export default DriverPenalties;