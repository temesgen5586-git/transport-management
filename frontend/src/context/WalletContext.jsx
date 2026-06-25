import React, { createContext, useState, useContext, useEffect } from 'react';
import { getBalance, getHistory, deposit } from '../api/wallet';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchWalletData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [balanceRes, historyRes] = await Promise.all([getBalance(), getHistory()]);
      setBalance(balanceRes.data.data.balance || 0);
      setTransactions(historyRes.data.data || []);
      setRecentTransactions((historyRes.data.data || []).slice(0, 5));
    } catch (error) {
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletData();
    }
  }, [isAuthenticated]);

  const refreshWallet = () => {
    fetchWalletData();
  };

  const handleDeposit = async (data) => {
    try {
      const res = await deposit(data);
      toast.success('Deposit initiated');
      await fetchWalletData();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deposit failed');
      throw error;
    }
  };

  const totalDeposits = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalSpent = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        recentTransactions,
        loading,
        totalDeposits,
        totalSpent,
        refreshWallet,
        handleDeposit,
        fetchWalletData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};