import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createBookingApi } from "../services/api";
import { formatCurrency } from "../utils/helpers";
import { Calendar, Clock, DollarSign, CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";

export const BookingModal = ({ center, service, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);

  const [bookingDate, setBookingDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate) {
      setError("Please select a valid booking date.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createBookingApi({
        center: center._id,
        service: service._id,
        bookingDate,
      });

      setSuccessMsg("Booking Created Successfully! Redirecting to My Bookings...");
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg p-6 sm:p-8 space-y-6 relative rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold">Book Maternity Service</h3>
            <p className="text-xs text-slate-500 font-semibold">{center?.centerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SERVICE BREAKDOWN SUMMARY */}
        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {service?.serviceName}
            </span>
            <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
              {formatCurrency(service?.price)}
            </span>
          </div>
          {service?.duration && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <Clock className="w-3.5 h-3.5" /> Duration: {service?.duration}
            </div>
          )}
          {service?.description && (
            <p className="text-xs text-slate-500 line-clamp-2">{service?.description}</p>
          )}
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Select Appointment Date & Time
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-5 h-5 text-rose-500 absolute left-3.5" />
              <input
                type="datetime-local"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-rose-500 font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !!successMsg}
              className="btn btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              {submitting ? "Booking..." : "Confirm Appointment"}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Instant Booking Request • Free Cancellation within 24h</span>
        </div>
      </div>
    </div>
  );
};
