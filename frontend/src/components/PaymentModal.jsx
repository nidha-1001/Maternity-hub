import React, { useState } from "react";
import { createPaymentApi } from "../services/api";
import { formatCurrency } from "../utils/helpers";
import { CreditCard, CheckCircle2, AlertCircle, X, ShieldCheck, Lock, Smartphone } from "lucide-react";

export const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("Online Card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const servicePrice = booking?.service?.price || 2500;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createPaymentApi({
        booking: booking._id,
        amount: servicePrice,
        paymentMethod,
        paymentStatus: "Paid",
      });

      setSuccess("Payment Processed Successfully! Booking Accepted.");
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Payment processing failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 sm:p-8 space-y-6 relative rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Complete Payment</h3>
              <p className="text-xs text-slate-500 font-semibold">Secure Checkout</p>
            </div>
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

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* AMOUNT DISPLAY */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/60 dark:border-emerald-900/60 text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Payable Amount</span>
          <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(servicePrice)}
          </h2>
          <p className="text-xs text-slate-500 font-semibold">{booking?.service?.serviceName || "Maternity Service"}</p>
        </div>

        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "Online Card", label: "Credit/Debit Card", icon: CreditCard },
                { id: "UPI / QR", label: "GPay / PhonePe / UPI", icon: Smartphone },
              ].map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === method.id
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-500"
                  }`}
                >
                  <method.icon className="w-5 h-5" />
                  <span>{method.label}</span>
                </button>
              ))}
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
              disabled={submitting || !!success}
              className="btn btn-secondary flex-1 py-3 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {submitting ? "Processing..." : `Pay ${formatCurrency(servicePrice)}`}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>256-Bit Encrypted Secure Payment Gateway</span>
        </div>
      </div>
    </div>
  );
};
