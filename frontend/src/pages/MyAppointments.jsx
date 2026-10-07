import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Building, AlertCircle, Trash2, ArrowRight, Home, Stethoscope, ShieldCheck } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";
import { motion } from "framer-motion";

const MyAppointments = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("center");

  // Center bookings
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Nurse bookings
  const [nurseBookings, setNurseBookings] = useState([]);
  const [loadingNurseBookings, setLoadingNurseBookings] = useState(true);
  const [nurseBookingsError, setNurseBookingsError] = useState(null);
  const [cancellingNurseId, setCancellingNurseId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMyBookings();
    fetchMyNurseBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoadingBookings(true);
    setBookingsError(null);
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data || []);
    } catch (err) {
      setBookingsError("Failed to load center appointments. Please try again.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchMyNurseBookings = async () => {
    setLoadingNurseBookings(true);
    setNurseBookingsError(null);
    try {
      const res = await api.get("/nurses/bookings/my");
      setNurseBookings(res.data || []);
    } catch (err) {
      setNurseBookingsError("Failed to load nurse bookings.");
    } finally {
      setLoadingNurseBookings(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(bookingId);
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelNurseBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this nurse booking?")) return;
    setCancellingNurseId(bookingId);
    try {
      await api.delete(`/nurses/bookings/${bookingId}`);
      setNurseBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel nurse booking");
    } finally {
      setCancellingNurseId(null);
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
              View and track all scheduled consultations for <strong className="text-slate-800">{user?.name}</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/centers" className="btn-secondary text-sm py-2.5 px-4 flex items-center gap-2">
              <Building className="w-4 h-4" /> Book Center
            </Link>
            <Link to="/home-nurses" className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> Book Nurse
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("center")}
            className={`pb-4 px-6 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "center"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Building className="w-4 h-4" />
            Center Appointments
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{bookings.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("nurse")}
            className={`pb-4 px-6 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "nurse"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Home className="w-4 h-4" />
            Home Nurse Visits
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary-100 text-primary-700">{nurseBookings.length}</span>
          </button>
        </div>

        {/* Center Appointments Tab */}
        {activeTab === "center" && (
          <>
            {bookingsError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {bookingsError}
              </div>
            )}

            {loadingBookings ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-3" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
                <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Center Appointments Yet</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Discover certified maternity centers and book your consultation today.
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
                              <Link to={`/centers/${booking.center._id}`} className="text-xs text-primary-600 hover:underline font-semibold">
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

                      <div className="grid sm:grid-cols-2 gap-4 mb-4 bg-primary-50/50 p-4 rounded-2xl border border-primary-100/60">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Package / Service</span>
                          <div className="font-bold text-slate-900 text-base">{booking.service?.serviceName || "Maternity Care"}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{booking.service?.duration || "Standard Care"}</div>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Consultation Fee</span>
                          <div className="text-xl font-extrabold text-primary-600">
                            ₹{Number(booking.service?.price || 0).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
                          <div>
                            <span className="text-slate-400 block font-medium">Appointment Date</span>
                            <span className="font-bold text-slate-800">
                              {booking.bookingDate
                                ? new Date(booking.bookingDate).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                                : "—"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                          <div>
                            <span className="text-slate-400 block font-medium">Scheduled Time</span>
                            <span className="font-bold text-slate-800">
                              {booking.bookingDate
                                ? new Date(booking.bookingDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                : "—"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                          <div>
                            <span className="text-slate-400 block font-medium">Registered Contact</span>
                            <span className="font-bold text-slate-800">+91 {booking.patientPhone || user?.phone || "On File"}</span>
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                          <strong className="text-slate-700">Special Notes:</strong> {booking.notes}
                        </div>
                      )}

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
          </>
        )}

        {/* Nurse Bookings Tab */}
        {activeTab === "nurse" && (
          <>
            {nurseBookingsError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {nurseBookingsError}
              </div>
            )}

            {loadingNurseBookings ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-3" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : nurseBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
                <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Home Nurse Bookings Yet</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Book a certified postpartum nurse or newborn care specialist for home visits.
                </p>
                <Link to="/home-nurses" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
                  Find a Home Nurse <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {nurseBookings.map((booking, index) => {
                  const status = booking.bookingStatus || "Pending";
                  const days = Math.ceil(
                    (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
                  ) + 1;

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
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-lg font-bold text-primary-600 border border-primary-200 flex-shrink-0">
                              {(booking.nurse?.name || "N").charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-xl font-bold text-slate-900">
                                  {booking.nurse?.name || "Home Nurse"}
                                </h3>
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              </div>
                              <p className="text-xs text-slate-500">{booking.nurse?.qualification || "Certified Nurse"}</p>
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={status} />
                      </div>

                      {/* Shift + pricing */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-4 bg-primary-50/50 p-4 rounded-2xl border border-primary-100/60">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Shift Type</span>
                          <div className="font-bold text-slate-900">{booking.shiftType}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{days} day{days !== 1 ? "s" : ""} scheduled</div>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Total Amount</span>
                          <div className="text-xl font-extrabold text-primary-600">
                            ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      {/* Dates + Address + Phone */}
                      <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
                          <div>
                            <span className="text-slate-400 block font-medium">Visit Dates</span>
                            <span className="font-bold text-slate-800">
                              {new Date(booking.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              {" – "}
                              {new Date(booking.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                          <div>
                            <span className="text-slate-400 block font-medium">Home Address</span>
                            <span className="font-bold text-slate-800">
                              {booking.homeAddress?.street ? `${booking.homeAddress.street}, ${booking.homeAddress.city}` : "On File"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                          <div>
                            <span className="text-slate-400 block font-medium">Nurse Contact</span>
                            <span className="font-bold text-slate-800">+91 {booking.nurse?.phone || "Assigned on confirm"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Specializations */}
                      {booking.nurse?.specializations?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {booking.nurse.specializations.map((spec) => (
                            <span key={spec} className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Patient notes */}
                      {booking.specialRequirements && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                          <strong className="text-slate-700">Special Requirements:</strong> {booking.specialRequirements}
                        </div>
                      )}

                      {status === "Pending" && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => handleCancelNurseBooking(booking._id)}
                            disabled={cancellingNurseId === booking._id}
                            className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {cancellingNurseId === booking._id ? "Cancelling..." : "Cancel Booking"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
