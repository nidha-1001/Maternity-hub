import React, { useEffect, useState } from "react";
import { getBookingsApi, deleteBookingApi } from "../services/api";
import { StatusBadge } from "../components/StatusBadge";
import { PaymentModal } from "../components/PaymentModal";
import { formatDate, formatCurrency } from "../utils/helpers";
import { Calendar, Building2, Trash2, CreditCard, CheckCircle2 } from "lucide-react";

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
    <div className="max-w-6xl mx-auto px-6 py-12 w-full">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">My Bookings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your maternity checkups and appointments.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-500 text-sm">
          Loading your bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No bookings found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You haven't scheduled any maternity appointments yet. Browse centers to book services.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="ui-card flex flex-col justify-between"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <StatusBadge status={booking.bookingStatus} />
                  <span className="text-xs font-medium text-slate-400">
                    ID: #{booking._id.slice(-6)}
                  </span>
                </div>

                <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-1">
                  {booking.service?.serviceName || "Maternity Care Service"}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <Building2 className="w-3.5 h-3.5" />
                  {booking.center?.centerName || "Maternity Center"}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">
                      {booking.bookingDate ? formatDate(booking.bookingDate) : "Scheduled Date"}
                    </span>
                  </div>
                  {booking.service?.price && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-500">Service Cost</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(booking.service.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-b-lg flex items-center justify-between gap-3">
                {booking.bookingStatus === "Pending" ? (
                  <button
                    onClick={() => setSelectedBookingForPayment(booking)}
                    className="btn btn-primary text-xs font-semibold py-2 px-4 flex-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                  </button>
                ) : booking.bookingStatus === "Accepted" ? (
                  <div className="flex-1 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-md border border-emerald-100 dark:border-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Confirmed
                  </div>
                ) : (
                  <div className="flex-1" />
                )}

                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
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
