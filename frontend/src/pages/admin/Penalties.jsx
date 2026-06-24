import React, { useState, useEffect } from 'react';
import { getPenalties, updatePenalty } from '../../api/admin';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Penalties = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ driver_id: '', penalty_type: '', is_paid: '' });

  useEffect(() => {
    fetchPenalties();
  }, [filters]);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const res = await getPenalties(filters);
      setPenalties(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch penalties');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await updatePenalty(id, { is_paid: true });
      toast.success('Penalty marked as paid');
      fetchPenalties();
    } catch (error) {
      toast.error('Failed to update penalty');
    }
  };

  const penaltyTypes = ['overcapacity', 'delay', 'traffic_violation'];

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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Penalty Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage driver penalties and violations</p>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">Total: {penalties.length} penalties</span>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          placeholder="Driver ID"
          value={filters.driver_id}
          onChange={(e) => setFilters({...filters, driver_id: e.target.value})}
          className="input-field"
        />
        <select
          value={filters.penalty_type}
          onChange={(e) => setFilters({...filters, penalty_type: e.target.value})}
          className="input-field"
        >
          <option value="">All Types</option>
          {penaltyTypes.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filters.is_paid}
          onChange={(e) => setFilters({...filters, is_paid: e.target.value})}
          className="input-field"
        >
          <option value="">All Status</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {penalties.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-300">
                  {p.driver_id?.slice(0, 8) || 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${
                    p.penalty_type === 'delay' ? 'badge-warning' :
                    p.penalty_type === 'overcapacity' ? 'badge-danger' :
                    'badge-info'
                  }`}>
                    {p.penalty_type}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(p.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {p.description || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${p.is_paid ? 'badge-success' : 'badge-danger'}`}>
                    {p.is_paid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(p.created_at)}
                </td>
                <td className="px-6 py-4">
                  {!p.is_paid && (
                    <button
                      onClick={() => handleMarkPaid(p.id)}
                      className="btn-primary text-xs px-3 py-1"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Penalties;