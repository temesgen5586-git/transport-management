import React, { useState, useEffect } from 'react';
import { getSettlements, requestPayout } from '../../api/driver';
import { getBalance } from '../../api/wallet';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';

const Settlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [showPayout, setShowPayout] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settlementsRes, balanceRes] = await Promise.all([getSettlements(), getBalance()]);
      setSettlements(settlementsRes.data.data);
      setBalance(balanceRes.data.data.balance);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally { setLoading(false); }
  };

  const handlePayout = async (e) => {
    e.preventDefault();
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) { toast.error('Invalid amount'); return; }
    try {
      await requestPayout({ amount: parseFloat(payoutAmount) });
      toast.success('Payout requested');
      setShowPayout(false);
      setPayoutAmount('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Payout failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settlements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your earnings and payouts</p>
        </div>
        <GradientButton variant="success" onClick={() => setShowPayout(true)}>Request Payout</GradientButton>
      </div>

      <GlassCard className="p-6 text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-3xl font-bold">ETB {balance.toFixed(2)}</p>
      </GlassCard>

      <GlassCard className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Trip</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Gross</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Net</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Penalty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Final</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {settlements.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-4 py-3">{s.trip_id.slice(0, 8)}</td>
                <td className="px-4 py-3">ETB {parseFloat(s.gross_earning).toFixed(2)}</td>
                <td className="px-4 py-3">ETB {parseFloat(s.net_earning).toFixed(2)}</td>
                <td className="px-4 py-3">ETB {parseFloat(s.penalty_deductions || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-medium">ETB {parseFloat(s.final_payout).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${s.payout_status === 'completed' ? 'badge-success' : s.payout_status === 'pending' ? 'badge-warning' : s.payout_status === 'processing' ? 'badge-info' : 'badge-danger'}`}>{s.payout_status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {showPayout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Request Payout</h2>
            <form onSubmit={handlePayout} className="space-y-3">
              <input type="number" step="0.01" placeholder="Amount" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} className="input-field" required />
              <p className="text-sm text-slate-500">Available: ETB {balance.toFixed(2)}</p>
              <div className="flex gap-3 mt-4">
                <GradientButton type="submit" variant="success" className="flex-1">Submit</GradientButton>
                <GradientButton variant="secondary" className="flex-1" onClick={() => { setShowPayout(false); setPayoutAmount(''); }}>Cancel</GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Settlements;