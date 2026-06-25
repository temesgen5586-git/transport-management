import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBooking } from '../../api/bookings';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import { DocumentIcon } from '@heroicons/react/24/outline';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(id)
      .then(res => { setBooking(res.data.data); setLoading(false); })
      .catch(() => { toast.error('Booking not found'); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;
  if (!booking) return <div className="text-center py-8 text-red-500">Booking not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Booking Details</h1>
      <GlassCard className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-medium">Seat:</span> {booking.seat_number}</div>
          <div><span className="font-medium">Route:</span> {booking.origin} → {booking.destination}</div>
          <div><span className="font-medium">Departure:</span> {new Date(booking.scheduled_departure).toLocaleString()}</div>
          <div><span className="font-medium">Price:</span> ETB {parseFloat(booking.price).toFixed(2)}</div>
          <div><span className="font-medium">Status:</span> <span className={`badge ${booking.booking_status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{booking.booking_status}</span></div>
          <div><span className="font-medium">QR Code:</span></div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
          <code className="text-sm break-all">{booking.qr_code_hash}</code>
        </div>
      </GlassCard>
    </div>
  );
};

export default BookingDetails;