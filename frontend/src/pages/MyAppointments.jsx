import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Building, AlertCircle, Trash2, CheckCircle2, ArrowRight } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";
import { motion } from "framer-motion";

const MyAppointments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching my bookings:", err);
      setError("Failed to load your appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment request?")) {
      return;
    }
    setCancellingId(bookingId);
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Appointments</h1>
            <p className="text-slate-600 text-sm mt-1">
              View and track all scheduled consultations and care packages for <strong className="text-slate-800">{user?.name}</strong>.
            </p>
          </div>
          <Link to="/centers" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 shadow-sm">
            Book Another Center <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Appointments Yet</h3>
            <p className="text-slate-600 text-sm mb-6">
              You have not booked any appointments with our maternity centers yet. Discover certified centers and book your consultation today.
            </p>
            <Link to="/centers" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
              Browse Certified Centers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking, index) => {
              const status = booking.bookingStatus || booking.status || "Pending";
              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 hover:border-primary-200 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {booking.center?.centerName || "Maternity Center"}
                        </h3>
                        {booking.center?._id && (
                          <Link 
                            to={`/centers/${booking.center._id}`} 
                            className="text-xs text-primary-600 hover:underline font-semibold"
                          >
                            View Center →
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-primary-500" />
                        {booking.center?.location || booking.center?.address || "Certified Facility"}
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  {/* Service info */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4 bg-primary-50/50 p-4 rounded-2xl border border-primary-100/60">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Package / Service</span>
                      <div className="font-bold text-slate-900 text-base">{booking.service?.serviceName || "Maternity Care"}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{booking.service?.duration || "Standard Care"}</div>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Consultation Fee</span>
                      <div className="text-xl font-extrabold text-primary-600">
                        ₹{Number(booking.service?.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Date & Contact Info */}
                  <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 block font-medium">Appointment Date</span>
                        <span className="font-bold text-slate-800">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 block font-medium">Scheduled Time</span>
                        <span className="font-bold text-slate-800">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 block font-medium">Registered Contact</span>
                        <span className="font-bold text-slate-800">
                          +91 {booking.patientPhone || user?.phone || "On File"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                      <strong className="text-slate-700">Special Notes:</strong> {booking.notes}
                    </div>
                  )}

                  {/* Actions footer */}
                  {status === "Pending" && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {cancellingId === booking._id ? "Cancelling..." : "Cancel Appointment"}
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
