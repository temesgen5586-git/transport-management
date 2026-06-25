

import React, { useState, useEffect } from 'react';
import { getBookings } from '../../api/bookings';
import { refund } from '../../api/wallet';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookings();
      setBookings(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally { setLoading(false); }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      setCancelling(bookingId);
      await refund({ booking_id: bookingId });
      toast.success('Booking cancelled and refunded');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Cancellation failed');
    } finally { setCancelling(null); }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'badge-success',
      checked_in: 'badge-info',
      cancelled: 'badge-danger',
      no_show: 'badge-gray',
      completed: 'badge-success',
    };
    return `badge ${styles[status] || 'badge-gray'}`;
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Bookings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">View and manage your reservations</p>
      </div>

      {bookings.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-500 dark:text-slate-400">No bookings found</GlassCard>
      ) : (
        bookings.map((booking) => (
          <GlassCard key={booking.id} className="p-4 flex flex-wrap justify-between items-center" interactive>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{booking.origin} → {booking.destination}</h3>
              <p className="text-sm text-slate-500">{new Date(booking.scheduled_departure).toLocaleString()}</p>
              <p className="text-sm text-slate-500">Seat: {booking.seat_number} · ETB {parseFloat(booking.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={getStatusBadge(booking.booking_status)}>{booking.booking_status}</span>
              <Link to={`/bookings/${booking.id}`} className="text-primary-600 hover:text-primary-800">
                <EyeIcon className="w-5 h-5" />
              </Link>
              {booking.booking_status === 'confirmed' && (
                <GradientButton variant="danger" size="sm" onClick={() => handleCancel(booking.id)} disabled={cancelling === booking.id}>
                  {cancelling === booking.id ? '...' : 'Cancel'}
                </GradientButton>
              )}
            </div>
          </GlassCard>
        ))
      )}
    </div>
  );
};

export default MyBookings;