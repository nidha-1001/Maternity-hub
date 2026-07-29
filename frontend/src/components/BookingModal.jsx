import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BookingModal = ({ center, service, onClose }) => {
  const [bookingDate, setBookingDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Book Appointment</h2>
            <p className="text-slate-600 text-sm mb-6">You are booking a service at <span className="font-semibold">{center?.name}</span>.</p>
            
            {success ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-medium">
                Appointment request sent successfully! We will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <h4 className="font-bold text-slate-900">{service?.name}</h4>
                  <div className="flex justify-between mt-1 text-sm text-slate-600">
                    <span>₹{service?.price?.toLocaleString('en-IN')}</span>
                    <span>{service?.duration}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="input-field"
                  />
                </div>
                
                <button type="submit" disabled={submitting} className="btn-primary w-full h-12 mt-4 text-lg">
                  {submitting ? "Processing..." : "Confirm Booking"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
