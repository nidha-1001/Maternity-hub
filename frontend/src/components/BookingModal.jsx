import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createBookingApi } from "../services/api";
import { formatCurrency } from "../utils/helpers";
import { Calendar, Clock, CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";

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
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book Appointment</h3>
            <p className="text-xs text-slate-500 font-medium">{center?.centerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium flex items-center gap-2 mb-4 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2 mb-4 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SERVICE SUMMARY */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {service?.serviceName}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {formatCurrency(service?.price)}
            </span>
          </div>
          {service?.duration && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" /> {service?.duration}
            </div>
          )}
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Appointment Date & Time
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="datetime-local"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !!successMsg}
              className="btn btn-primary flex-1"
            >
              {submitting ? "Booking..." : "Confirm"}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Secure appointment request</span>
        </div>
      </div>
    </div>
  );
};
