import React, { useState, useEffect } from 'react';
import { getBalance, getHistory, deposit } from '../../api/wallet';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { PlusIcon } from '@heroicons/react/24/outline';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositData, setDepositData] = useState({ amount: '', gateway: 'telebirr', phone: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balanceRes, historyRes] = await Promise.all([getBalance(), getHistory()]);
      setBalance(balanceRes.data.data.balance);
      setTransactions(historyRes.data.data);
    } catch (error) {
      toast.error('Failed to load wallet data');
    } finally { setLoading(false); }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await deposit(depositData);
      toast.success('Deposit initiated');
      setShowDeposit(false);
      setDepositData({ amount: '', gateway: 'telebirr', phone: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deposit failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Wallet</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your funds</p>
        </div>
        <GradientButton variant="primary" icon={PlusIcon} onClick={() => setShowDeposit(true)}>Add Funds</GradientButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center" interactive hoverEffect="lift">
          <p className="text-sm text-slate-500 dark:text-slate-400">Balance</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">ETB {balance.toFixed(2)}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center" interactive hoverEffect="lift">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Deposits</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ETB {transactions.filter(t => t.amount > 0).reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2)}
          </p>
        </GlassCard>
        <GlassCard className="p-6 text-center" interactive hoverEffect="lift">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ETB {transactions.filter(t => t.amount < 0).reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2)}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-4 py-3 text-sm">{new Date(tx.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${tx.transaction_type === 'deposit' ? 'badge-success' : tx.transaction_type === 'booking_payment' ? 'badge-info' : tx.transaction_type === 'refund_credit' ? 'badge-warning' : tx.transaction_type === 'driver_payout' ? 'badge-info' : 'badge-danger'}`}>
                    {tx.transaction_type}
                  </span>
                </td>
                <td className={`px-4 py-3 font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{parseFloat(tx.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3">ETB {parseFloat(tx.balance_after).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{tx.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {showDeposit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Add Funds</h2>
            <form onSubmit={handleDeposit} className="space-y-3">
              <input type="number" step="0.01" placeholder="Amount" value={depositData.amount} onChange={(e) => setDepositData({...depositData, amount: e.target.value})} className="input-field" required />
              <select value={depositData.gateway} onChange={(e) => setDepositData({...depositData, gateway: e.target.value})} className="input-field">
                <option value="telebirr">Telebirr</option>
                <option value="cbebirr">CBEBirr</option>
                <option value="cbe_bank">CBE Bank</option>
              </select>
              <input placeholder="Phone Number" value={depositData.phone} onChange={(e) => setDepositData({...depositData, phone: e.target.value})} className="input-field" required />
              <div className="flex gap-3 mt-4">
                <GradientButton type="submit" variant="primary" className="flex-1">Deposit</GradientButton>
                <GradientButton variant="secondary" className="flex-1" onClick={() => setShowDeposit(false)}>Cancel</GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Wallet;