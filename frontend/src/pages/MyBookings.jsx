import React, { useEffect, useState } from "react";
import { getBookingsApi, deleteBookingApi } from "../services/api";
import { StatusBadge } from "../components/StatusBadge";
import { PaymentModal } from "../components/PaymentModal";
import { formatDate, formatCurrency } from "../utils/helpers";
import { Calendar, Building2, Clock, Trash2, CreditCard, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await getBookingsApi();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking appointment?")) {
      try {
        await deleteBookingApi(id);
        fetchBookings();
      } catch (err) {
        alert("Failed to cancel booking.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">My Bookings & Appointments</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Track your scheduled maternity checkups, birthing suite reservations, and payment status.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-500">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold">No Bookings Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't scheduled any maternity appointments yet. Explore certified centers to book services!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status={booking.bookingStatus} />
                  <span className="text-xs font-semibold text-slate-400">
                    ID: #{booking._id.slice(-6)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-snug">
                    {booking.service?.serviceName || "Maternity Care Service"}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {booking.center?.centerName || "Maternity Center"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <span className="font-bold">
                      {booking.bookingDate ? formatDate(booking.bookingDate) : "Scheduled Date"}
                    </span>
                  </div>
                  {booking.service?.price && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>Service Cost:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        {formatCurrency(booking.service.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                {booking.bookingStatus === "Pending" && (
                  <button
                    onClick={() => setSelectedBookingForPayment(booking)}
                    className="btn btn-secondary text-xs flex-1 py-2"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                  </button>
                )}

                {booking.bookingStatus === "Accepted" && (
                  <div className="flex-1 text-center py-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Appointment Confirmed
                  </div>
                )}

                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="btn btn-ghost text-xs p-2 text-slate-400 hover:text-rose-600"
                  title="Cancel Booking"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAYMENT MODAL */}
      {selectedBookingForPayment && (
        <PaymentModal
          booking={selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onSuccess={() => fetchBookings()}
        />
      )}
    </div>
  );
};
