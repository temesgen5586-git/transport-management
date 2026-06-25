import React, { useState, useEffect } from 'react';
import { getAuditLogs, exportAuditLogs } from '../../api/audit';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    user_id: '',
    action_type: '',
    entity_type: '',
    start_date: '',
    end_date: '',
    limit: 50,
    offset: 0
  });
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const actionTypes = ['LOGIN', 'USER_REGISTERED', 'BOOKING_CREATED', 'BOOKING_CANCELLED', 'TRIP_SCHEDULED', 'TRIP_DEPARTED', 'TRIP_COMPLETED', 'ADMIN_CREATED_USER', 'ROUTE_CREATED', 'VEHICLE_REGISTERED', 'CITY_CREATED', 'PAYOUT_REQUESTED', 'FREIGHT_ORDER_CREATED', 'CUSTOMS_DOCUMENT_UPLOADED', 'PENALTY_AUTO_APPLIED', 'EMERGENCY_TRIGGERED'];
  const entityTypes = ['USER', 'BOOKING', 'TRIP', 'VEHICLE', 'ROUTE', 'CITY', 'FREIGHT_ORDER', 'AUDIT_LOG', 'PENALTY', 'EMERGENCY_LOG'];

  useEffect(() => { fetchLogs(); }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs(filters);
      setLogs(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch audit logs');
    } finally { setLoading(false); }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await exportAuditLogs({ start_date: filters.start_date, end_date: filters.end_date });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${Date.now()}.json`;
      link.click();
      link.remove();
      toast.success('Exported');
    } catch (error) {
      toast.error('Export failed');
    } finally { setExporting(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Audit Logs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Complete audit trail</p>
        </div>
        <GradientButton variant="secondary" icon={DocumentArrowDownIcon} onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exporting...' : 'Export'}
        </GradientButton>
      </div>

      <GlassCard className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input placeholder="User ID" value={filters.user_id} onChange={(e) => setFilters({...filters, user_id: e.target.value})} className="input-field" />
        <select value={filters.action_type} onChange={(e) => setFilters({...filters, action_type: e.target.value})} className="input-field">
          <option value="">All Actions</option>
          {actionTypes.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filters.entity_type} onChange={(e) => setFilters({...filters, entity_type: e.target.value})} className="input-field">
          <option value="">All Entities</option>
          {entityTypes.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <input type="date" value={filters.start_date} onChange={(e) => setFilters({...filters, start_date: e.target.value})} className="input-field" />
        <input type="date" value={filters.end_date} onChange={(e) => setFilters({...filters, end_date: e.target.value})} className="input-field" />
        <GradientButton variant="primary" icon={MagnifyingGlassIcon} onClick={fetchLogs}>Search</GradientButton>
      </GlassCard>

      <GlassCard className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">IP</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-4 py-3 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-xs">{log.user_id?.slice(0,8)}</td>
                <td className="px-4 py-3"><span className="badge badge-info">{log.action_type}</span></td>
                <td className="px-4 py-3"><span className="badge badge-gray">{log.entity_type}</span></td>
                <td className="px-4 py-3 text-xs">{log.ip_address || '-'}</td>
                <td className="px-4 py-3 text-xs">
                  {log.new_values ? <details><summary className="text-primary-600 cursor-pointer">View</summary><pre className="mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded text-xs">{JSON.stringify(log.new_values, null, 2)}</pre></details> : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {pagination.total > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Showing {filters.offset+1} - {Math.min(filters.offset+filters.limit, pagination.total)} of {pagination.total}</span>
          <div className="flex gap-2">
            <button onClick={() => setFilters({...filters, offset: Math.max(0, filters.offset - filters.limit)})} disabled={filters.offset===0} className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button onClick={() => setFilters({...filters, offset: filters.offset + filters.limit})} disabled={filters.offset + filters.limit >= pagination.total} className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;