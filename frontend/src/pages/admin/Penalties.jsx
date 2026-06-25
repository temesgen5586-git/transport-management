import React, { useState, useEffect } from 'react';
import { getPenalties, updatePenalty } from '../../api/admin';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Penalties = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ driver_id: '', penalty_type: '', is_paid: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchPenalties(); }, [filters]);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const res = await getPenalties(filters);
      setPenalties(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch penalties');
    } finally { setLoading(false); }
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

  const filteredPenalties = penalties.filter(p =>
    p.driver_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.penalty_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Penalty Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage driver penalties and violations</p>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">Total: {filteredPenalties.length} penalties</span>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search penalties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
        </div>
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
      </GlassCard>

      {/* Penalties Table */}
      <GlassCard className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
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
            {filteredPenalties.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No penalties found
                </td>
              </tr>
            ) : (
              filteredPenalties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
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
                      <GradientButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleMarkPaid(p.id)}
                      >
                        Mark Paid
                      </GradientButton>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

export default Penalties;