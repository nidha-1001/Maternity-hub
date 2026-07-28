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
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment</h3>
              <p className="text-xs text-slate-500 font-medium">Secure Checkout</p>
            </div>
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

        {success && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2 mb-4 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* AMOUNT */}
        <div className="text-center py-6 border-b border-slate-100 dark:border-slate-800 mb-6 space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount Due</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(servicePrice)}
          </h2>
          <p className="text-sm text-slate-500">{booking?.service?.serviceName || "Maternity Service"}</p>
        </div>

        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "Online Card", label: "Card", icon: CreditCard },
                { id: "UPI / QR", label: "UPI", icon: Smartphone },
              ].map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === method.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <method.icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{method.label}</span>
                </button>
              ))}
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
              disabled={submitting || !!success}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {submitting ? "Processing..." : `Pay Now`}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
      </div>
    </div>
  );
};
