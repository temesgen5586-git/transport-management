import React, { useState, useEffect } from 'react';
import { getOrders, matchReturnLoad } from '../../api/freight';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally { setLoading(false); }
  };

  const handleMatch = async (orderId) => {
    try {
      const res = await matchReturnLoad(orderId);
      setMatches(res.data.data);
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to find matches');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Freight Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your cargo shipments</p>
      </div>

      {orders.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-500">No freight orders</GlassCard>
      ) : (
        orders.map((order) => (
          <GlassCard key={order.id} className="p-4 flex justify-between items-center" interactive>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{order.pickup_city} → {order.dropoff_city}</h3>
              <p className="text-sm text-slate-500">Weight: {order.weight_kg} kg · Volume: {order.volume_cbm || '-'} m³</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${order.status === 'pending' ? 'badge-warning' : order.status === 'assigned' ? 'badge-info' : order.status === 'in_transit' ? 'badge-info' : order.status === 'delivered' ? 'badge-success' : 'badge-danger'}`}>{order.status}</span>
              <GradientButton variant="secondary" size="sm" onClick={() => handleMatch(order.id)}>Find Return Load</GradientButton>
            </div>
          </GlassCard>
        ))
      )}

      {matches && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Return Load Matches</h2>
            {matches.length === 0 ? <p className="text-slate-500">No return loads available</p> : (
              <div className="space-y-3">
                {matches.map((m) => (
                  <div key={m.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <div>
                      <p className="font-medium">To: {m.destination_city}</p>
                      <p className="text-sm text-slate-500">{m.weight_kg} kg</p>
                    </div>
                    <GradientButton variant="success" size="sm">Accept</GradientButton>
                  </div>
                ))}
              </div>
            )}
            <GradientButton variant="secondary" className="mt-4 w-full" onClick={() => setMatches(null)}>Close</GradientButton>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Orders;