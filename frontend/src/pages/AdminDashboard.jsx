import { useState, useEffect } from "react";
import { Building, Check, X, ShieldAlert, Users, Calendar, Loader2, Plus, Trash2, MapPin, Phone, Mail } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { api } from "../services/api";

const AdminDashboard = () => {
  const [centers, setCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("centers");
  const [actionLoading, setActionLoading] = useState(null);
  const [bookingActionLoading, setBookingActionLoading] = useState(null);

  // Booking filtering & search
  const [bookingStatusFilter, setBookingStatusFilter] = useState("All");
  const [bookingSearch, setBookingSearch] = useState("");

  // Add Center Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingCenter, setSubmittingCenter] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    centerName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    description: "",
    password: "provider123",
    status: "Approved"
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [centersRes, bookingsRes] = await Promise.all([
        api.get("/centers/admin/all"),
        api.get("/bookings/all")
      ]);
      setCenters(centersRes.data || []);
      const normalizedBookings = (bookingsRes.data || []).map(b => ({
        ...b,
        status: b.bookingStatus || b.status,
        bookingStatus: b.bookingStatus || b.status
      }));
      setBookings(normalizedBookings);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCenterSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const digitsOnly = String(formData.phone).replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setFormError("Phone number must be exactly 10 digits");
      return;
    }

    setSubmittingCenter(true);

    try {
      const res = await api.post("/centers", { ...formData, phone: digitsOnly });
      const newCenter = res.data.center || res.data;
      setCenters([newCenter, ...centers]);
      setShowAddModal(false);
      setFormData({
        centerName: "",
        ownerName: "",
        email: "",
        phone: "",
        location: "",
        address: "",
        description: "",
        password: "provider123",
        status: "Approved"
      });
    } catch (error) {
      console.error("Failed to add maternity center:", error);
      setFormError(error.response?.data?.message || "Failed to add maternity center");
    } finally {
      setSubmittingCenter(false);
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    setBookingActionLoading(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, bookingStatus: newStatus, status: newStatus } : b));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update booking status");
    } finally {
      setBookingActionLoading(null);
    }
  };

  const handleDeleteCenter = async (centerId, centerName) => {
    if (!window.confirm(`Are you sure you want to delete "${centerName}"? All associated services will also be removed.`)) {
      return;
    }
    setActionLoading(centerId);
    try {
      await api.delete(`/centers/${centerId}`);
      setCenters(centers.filter((c) => c._id !== centerId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete center");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (centerId, newStatus) => {
    setActionLoading(centerId);
    try {
      await api.put(`/centers/${centerId}/status`, { status: newStatus });
      setCenters(centers.map(c => c._id === centerId ? { ...c, status: newStatus } : c));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update center status");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCenters = centers.filter(c => c.status === "Pending");
  const approvedCenters = centers.filter(c => c.status === "Approved");

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-extrabold text-slate-900">Admin Control Center</h1>
          </div>
          <p className="text-slate-600">Review maternity center applications and monitor global bookings.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500">Total Centers</span>
              <Building className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{centers.length}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-700">Pending Review</span>
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-700">{pendingCenters.length}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500">Approved Centers</span>
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{approvedCenters.length}</div>
          </div>

          <button
            onClick={() => setActiveTab("bookings")}
            className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm hover:shadow-md hover:border-secondary-400 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 group-hover:text-secondary-600 transition-colors">Total Bookings</span>
              <Calendar className="w-5 h-5 text-secondary-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{bookings.length}</div>
            <div className="text-xs text-secondary-500 mt-1 font-medium">Click to view list →</div>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-8">
          <button 
            onClick={() => setActiveTab("centers")}
            className={`pb-4 px-6 font-bold text-base border-b-2 transition-colors ${activeTab === 'centers' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Maternity Centers ({centers.length})
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`pb-4 px-6 font-bold text-base border-b-2 transition-colors ${activeTab === 'bookings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Global Bookings ({bookings.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mr-3" /> Fetching admin data...
          </div>
        ) : activeTab === "centers" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Center Applications & Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage and register certified maternity hospitals</p>
              </div>
              <button 
                onClick={() => {
                  setFormError("");
                  setShowAddModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add Maternity Center
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">Center Name</th>
                    <th className="py-4 px-6">Owner / Contact</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {centers.map((center) => (
                    <tr key={center._id} className="hover:bg-slate-50/60">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{center.centerName}</div>
                        <div className="text-xs text-slate-500">{center.description?.slice(0, 50)}...</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-900 font-medium">{center.ownerName}</div>
                        <div className="text-xs text-slate-500">{center.email} • {center.phone}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{center.location}</td>
                      <td className="py-4 px-6">
                        <StatusBadge status={center.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {center.status === "Pending" ? (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(center._id, "Approved")}
                                disabled={actionLoading === center._id}
                                className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" /> Approve
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(center._id, "Rejected")}
                                disabled={actionLoading === center._id}
                                className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors flex items-center"
                              >
                                <X className="w-3.5 h-3.5 mr-1" /> Reject
                              </button>
                            </>
                          ) : center.status === "Approved" ? (
                            <button 
                              onClick={() => handleStatusUpdate(center._id, "Rejected")}
                              disabled={actionLoading === center._id}
                              className="text-xs text-rose-600 font-medium hover:underline px-2 py-1"
                            >
                              Revoke
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusUpdate(center._id, "Approved")}
                              disabled={actionLoading === center._id}
                              className="text-xs text-emerald-600 font-medium hover:underline px-2 py-1"
                            >
                              Re-Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCenter(center._id, center.centerName)}
                            disabled={actionLoading === center._id}
                            title="Delete Center"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">All Platform Appointments</h2>
                <p className="text-slate-500 text-xs mt-0.5">Manage and track bookings across all maternity centers</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search patient, center, or service..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full sm:w-64"
                />

                <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs">
                  {["All", "Pending", "Accepted", "Rejected", "Completed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${bookingStatusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">Patient</th>
                    <th className="py-4 px-6">Center &amp; Service</th>
                    <th className="py-4 px-6">Appointment Date</th>
                    <th className="py-4 px-6">Fee</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {bookings.filter(b => {
                    const statusVal = b.bookingStatus || b.status;
                    const matchesStatus = bookingStatusFilter === "All" || statusVal === bookingStatusFilter;
                    const s = bookingSearch.toLowerCase();
                    const matchesSearch = !bookingSearch ||
                      (b.user?.name || "").toLowerCase().includes(s) ||
                      (b.center?.centerName || "").toLowerCase().includes(s) ||
                      (b.service?.serviceName || "").toLowerCase().includes(s) ||
                      (b.patientPhone || "").includes(s);
                    return matchesStatus && matchesSearch;
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400">
                        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <div className="font-medium">No appointments found</div>
                        <div className="text-xs mt-1">Bookings matching your filter will appear here</div>
                      </td>
                    </tr>
                  ) : (
                    bookings.filter(b => {
                      const statusVal = b.bookingStatus || b.status;
                      const matchesStatus = bookingStatusFilter === "All" || statusVal === bookingStatusFilter;
                      const s = bookingSearch.toLowerCase();
                      const matchesSearch = !bookingSearch ||
                        (b.user?.name || "").toLowerCase().includes(s) ||
                        (b.center?.centerName || "").toLowerCase().includes(s) ||
                        (b.service?.serviceName || "").toLowerCase().includes(s) ||
                        (b.patientPhone || "").includes(s);
                      return matchesStatus && matchesSearch;
                    }).map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{b.user?.name || "Patient"}</div>
                          <div className="text-xs text-slate-500">{b.user?.email}</div>
                          {(b.patientPhone || b.user?.phone) && (
                            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded mt-1">
                              <Phone className="w-3 h-3 text-primary-500" /> +91 {b.patientPhone || b.user?.phone}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{b.center?.centerName}</div>
                          <div className="text-xs font-semibold text-primary-600">{b.service?.serviceName}</div>
                          {b.center?.location && (
                            <div className="text-[11px] text-slate-400 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-0.5" /> {b.center?.location}
                            </div>
                          )}
                          {b.notes && (
                            <div className="text-xs text-slate-500 italic mt-1 bg-amber-50/70 p-1.5 rounded border border-amber-100">
                              "{b.notes}"
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-600 text-xs">
                          {b.bookingDate ? (
                            <div>
                              <div className="font-semibold text-slate-800">{new Date(b.bookingDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                              <div className="text-slate-400">{new Date(b.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          ) : "—"}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ₹{Number(b.service?.price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={b.bookingStatus || b.status} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {(b.bookingStatus || b.status) === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleBookingStatusUpdate(b._id, 'Accepted')}
                                  disabled={bookingActionLoading === b._id}
                                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleBookingStatusUpdate(b._id, 'Rejected')}
                                  disabled={bookingActionLoading === b._id}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {(b.bookingStatus || b.status) === 'Accepted' && (
                              <button
                                onClick={() => handleBookingStatusUpdate(b._id, 'Completed')}
                                disabled={bookingActionLoading === b._id}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors"
                              >
                                Complete
                              </button>
                            )}

                            {/* Dropdown status changer */}
                            <select
                              value={b.bookingStatus || b.status}
                              onChange={(e) => handleBookingStatusUpdate(b._id, e.target.value)}
                              disabled={bookingActionLoading === b._id}
                              className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Maternity Center Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden relative border border-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Add New Maternity Center</h3>
                      <p className="text-xs text-slate-500">Register a center directly and create provider credentials</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleAddCenterSubmit} className="p-6 overflow-y-auto space-y-4">
                {formError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Center Name *
                    </label>
                    <input
                      type="text"
                      name="centerName"
                      required
                      placeholder="e.g. Blossom Maternity Care"
                      value={formData.centerName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Owner / Lead Doctor Name *
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      required
                      placeholder="e.g. Dr. Sarah Jenkins"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="provider@blossom.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. Kochi, Kerala or San Francisco, CA"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Initial Approval Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-slate-800"
                    >
                      <option value="Approved">Approved (Immediate Live)</option>
                      <option value="Pending">Pending Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="e.g. 450 Healthcare Ave, Suite 200"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Provider Login Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    placeholder="Default: provider123"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    The center owner can log in using their email and this password to manage services & bookings.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description & Facilities
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    placeholder="Describe services, water birth suites, NICU level, neonatal nursing, etc."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCenter}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-70"
                  >
                    {submittingCenter && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Maternity Center
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
