import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBooking } from '../../api/bookings';
import { deposit } from '../../api/wallet';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId || '';
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!bookingId) { toast.error('No booking'); navigate('/my-bookings'); return; }
    getBooking(bookingId)
      .then(res => { setBooking(res.data.data); setLoading(false); })
      .catch(() => { toast.error('Failed'); navigate('/my-bookings'); });
  }, [bookingId, navigate]);

  const handlePayment = async () => {
    if (paymentMethod === 'wallet') { toast.success('Paid via wallet'); navigate('/my-bookings'); return; }
    if (!phone) { toast.error('Phone required'); return; }
    setProcessing(true);
    try {
      await deposit({ amount: booking.price, gateway: paymentMethod, phone });
      toast.success('Payment initiated');
      navigate('/my-bookings');
    } catch (e) { toast.error(e.response?.data?.error || 'Payment failed'); }
    finally { setProcessing(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;
  if (!booking) return <div className="text-center py-8">Not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Payment</h1>
      <GlassCard className="p-6 space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Booking Summary</h2>
          <p className="text-sm text-slate-500">Trip: {booking.origin} → {booking.destination}</p>
          <p className="text-sm text-slate-500">Seat: {booking.seat_number}</p>
          <p className="text-lg font-bold mt-2">Total: ETB {parseFloat(booking.price).toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
            <option value="wallet">Wallet</option>
            <option value="telebirr">Telebirr</option>
            <option value="cbebirr">CBEBirr</option>
          </select>
        </div>
        {paymentMethod !== 'wallet' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09XXXXXXXX" className="input-field" />
          </div>
        )}
        <div className="flex gap-3">
          <GradientButton variant="primary" className="flex-1" onClick={handlePayment} disabled={processing}>
            {processing ? 'Processing...' : 'Pay Now'}
          </GradientButton>
          <GradientButton variant="secondary" className="flex-1" onClick={() => navigate(-1)}>Cancel</GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default Payment;