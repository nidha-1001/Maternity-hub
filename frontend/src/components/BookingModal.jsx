import { useState, useContext } from "react";
import { X, Lock, CheckCircle2, Calendar, Clock, MapPin, AlertCircle, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../services/api";

export const BookingModal = ({ center, service, onClose }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [bookingDate, setBookingDate] = useState("");
  const [phone, setPhone] = useState(user?.phone ? String(user.phone).replace(/\D/g, '').slice(-10) : "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);

  // Validation state
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (val && val.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate phone number
    if (!phone || phone.length !== 10) {
      setPhoneError("A valid 10-digit phone number is required");
      return;
    }

    if (!bookingDate) {
      setError("Please select an appointment date and time");
      return;
    }

    const selectedTime = new Date(bookingDate).getTime();
    if (selectedTime <= Date.now()) {
      setError("Appointment time must be in the future");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/bookings", {
        centerId: center?._id,
        serviceId: service?._id,
        bookingDate,
        patientPhone: phone,
        notes: notes.trim(),
      });

      setSuccessBooking(res.data?.booking || { bookingDate, service, center });
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.response?.data?.message || "Failed to schedule appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const minDateTime = new Date(Date.now() + 3600000).toISOString().slice(0, 16);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-100 my-auto"
        >
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Guest / Unauthenticated State */}
          {!user ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In Required</h2>
              <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">
                You must be signed in with an account to schedule an appointment at <span className="font-semibold text-slate-900">{center?.centerName || center?.name}</span>.
              </p>

              <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 text-left mb-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">Selected Service</div>
                <div className="font-bold text-slate-900">{service?.serviceName || service?.name}</div>
                <div className="flex justify-between items-center text-sm text-slate-600 mt-2 pt-2 border-t border-primary-100">
                  <span>Price: <strong className="text-primary-600">₹{service?.price?.toLocaleString('en-IN')}</strong></span>
                  <span>Duration: {service?.duration}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onClose();
                    navigate("/login", { state: { from: location.pathname } });
                  }}
                  className="btn-primary flex-1 py-3 text-base justify-center flex items-center gap-2"
                >
                  Sign In to Book <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/register", { state: { from: location.pathname } });
                  }}
                  className="btn-secondary flex-1 py-3 text-base justify-center"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : successBooking ? (
            /* Booking Confirmed State */
            <div className="p-8 text-center">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-9 h-9" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Appointment Confirmed!</h2>
              <p className="text-slate-600 text-sm mb-6">
                Your appointment has been registered and is pending approval by the maternity center.
              </p>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 mb-6">
                <div className="flex justify-between items-start pb-3 border-b border-slate-200/60">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Center</span>
                    <div className="font-bold text-slate-900">{center?.centerName || center?.name}</div>
                    <div className="text-xs text-slate-500 flex items-center mt-0.5">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-primary-500" />
                      {center?.location || center?.address}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 font-bold rounded-lg text-xs">
                    Pending
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Service</span>
                  <div className="font-semibold text-slate-900">{service?.serviceName || service?.name}</div>
                  <div className="text-xs text-primary-600 font-bold mt-0.5">₹{service?.price?.toLocaleString('en-IN')} • {service?.duration}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-500 block">Date & Time</span>
                    <span className="font-medium text-slate-900">{new Date(bookingDate).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">Contact Phone</span>
                    <span className="font-medium text-slate-900">+91 {phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    onClose();
                    navigate("/my-appointments");
                  }} 
                  className="btn-primary flex-1 py-3 text-sm justify-center"
                >
                  View My Appointments
                </button>
                <button 
                  onClick={onClose} 
                  className="btn-secondary flex-1 py-3 text-sm justify-center"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Book Appointment</h2>
              <p className="text-slate-600 text-sm mb-6">
                Booking at <span className="font-semibold text-primary-600">{center?.centerName || center?.name}</span>
              </p>

              {error && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Selected Service Card */}
                <div className="p-4 bg-primary-50/70 rounded-2xl border border-primary-100">
                  <div className="text-xs uppercase font-bold text-primary-600 tracking-wider mb-1">Selected Package</div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-base">{service?.serviceName || service?.name}</h4>
                    <div className="text-primary-600 font-extrabold text-lg whitespace-nowrap">
                      ₹{service?.price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>Duration: {service?.duration || "60 mins"}</span>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block font-medium">Patient</span>
                    <span className="font-bold text-slate-800 text-sm">{user.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block font-medium">Account</span>
                    <span className="text-slate-700 font-medium">{user.email}</span>
                  </div>
                </div>

                {/* 10-digit Phone input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400 text-sm font-medium">
                      <Phone className="w-4 h-4 mr-1 text-primary-500" /> +91
                    </div>
                    <input 
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      className={`input-field pl-16 h-11 text-sm ${phoneError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''}`}
                    />
                  </div>
                  {phoneError ? (
                    <p className="text-xs text-rose-500 mt-1">{phoneError}</p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1">Hospital staff will use this 10-digit number to confirm the appointment.</p>
                  )}
                </div>

                {/* Date and Time Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Appointment Date & Time *
                  </label>
                  <div className="relative">
                    <input 
                      type="datetime-local" 
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={minDateTime}
                      className="input-field h-11 text-sm"
                    />
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Notes / Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 28th week pregnancy checkup, request wheelchair assistance..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field text-sm resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitting || (phone && phone.length !== 10)} 
                  className="btn-primary w-full h-12 mt-2 text-base font-bold shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Confirming Appointment..." : "Confirm & Book Appointment"}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
