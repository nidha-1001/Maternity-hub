import { useState, useEffect } from "react";
import { Building, Check, X, ShieldAlert, Calendar, Loader2, Plus, Trash2, MapPin, Phone, Stethoscope, Star, Home } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { api } from "../services/api";

const AdminDashboard = () => {
  const [centers, setCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [nurseBookings, setNurseBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("centers");
  const [actionLoading, setActionLoading] = useState(null);
  const [bookingActionLoading, setBookingActionLoading] = useState(null);
  const [nurseActionLoading, setNurseActionLoading] = useState(null);
  const [nurseBookingActionLoading, setNurseBookingActionLoading] = useState(null);

  // Booking filtering & search
  const [bookingStatusFilter, setBookingStatusFilter] = useState("All");
  const [bookingSearch, setBookingSearch] = useState("");

  // Nurse booking filtering
  const [nurseBookingStatusFilter, setNurseBookingStatusFilter] = useState("All");
  const [nurseBookingSearch, setNurseBookingSearch] = useState("");

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
      const [centersRes, bookingsRes, nursesRes, nurseBookingsRes] = await Promise.all([
        api.get("/centers/admin/all"),
        api.get("/bookings/all"),
        api.get("/nurses/admin/all"),
        api.get("/nurses/bookings/all")
      ]);
      setCenters(centersRes.data || []);
      const normalizedBookings = (bookingsRes.data || []).map(b => ({
        ...b,
        status: b.bookingStatus || b.status,
        bookingStatus: b.bookingStatus || b.status
      }));
      setBookings(normalizedBookings);
      setNurses(nursesRes.data || []);
      setNurseBookings(nurseBookingsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const clean = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: clean }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCenterSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const digitsOnly = String(formData.phone).replace(/\D/g, "");
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
      setFormData({ centerName: "", ownerName: "", email: "", phone: "", location: "", address: "", description: "", password: "provider123", status: "Approved" });
    } catch (error) {
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
    if (!window.confirm(`Are you sure you want to delete "${centerName}"? All associated services will also be removed.`)) return;
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

  const handleNurseStatusUpdate = async (nurseId, newStatus) => {
    setNurseActionLoading(nurseId);
    try {
      await api.put(`/nurses/${nurseId}/status`, { status: newStatus });
      setNurses(prev => prev.map(n => n._id === nurseId ? { ...n, verificationStatus: newStatus } : n));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update nurse status");
    } finally {
      setNurseActionLoading(null);
    }
  };

  const handleDeleteNurse = async (nurseId, nurseName) => {
    if (!window.confirm(`Are you sure you want to remove "${nurseName}" from the platform?`)) return;
    setNurseActionLoading(nurseId);
    try {
      await api.delete(`/nurses/${nurseId}`);
      setNurses(nurses.filter(n => n._id !== nurseId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete nurse");
    } finally {
      setNurseActionLoading(null);
    }
  };

  const handleNurseBookingStatusUpdate = async (bookingId, newStatus) => {
    setNurseBookingActionLoading(bookingId);
    try {
      await api.put(`/nurses/bookings/${bookingId}/status`, { status: newStatus });
      setNurseBookings(prev => prev.map(b => b._id === bookingId ? { ...b, bookingStatus: newStatus } : b));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update nurse booking status");
    } finally {
      setNurseBookingActionLoading(null);
    }
  };

  const pendingCenters = centers.filter(c => c.status === "Pending");
  const approvedCenters = centers.filter(c => c.status === "Approved");

  const filteredBookings = bookings.filter(b => {
    const statusVal = b.bookingStatus || b.status;
    const matchesStatus = bookingStatusFilter === "All" || statusVal === bookingStatusFilter;
    const s = bookingSearch.toLowerCase();
    const matchesSearch = !bookingSearch ||
      (b.user?.name || "").toLowerCase().includes(s) ||
      (b.center?.centerName || "").toLowerCase().includes(s) ||
      (b.service?.serviceName || "").toLowerCase().includes(s) ||
      (b.patientPhone || "").includes(s);
    return matchesStatus && matchesSearch;
  });

  const filteredNurseBookings = nurseBookings.filter(b => {
    const matchesStatus = nurseBookingStatusFilter === "All" || b.bookingStatus === nurseBookingStatusFilter;
    const s = nurseBookingSearch.toLowerCase();
    const matchesSearch = !nurseBookingSearch ||
      (b.user?.name || "").toLowerCase().includes(s) ||
      (b.nurse?.name || "").toLowerCase().includes(s) ||
      (b.homeAddress?.city || "").toLowerCase().includes(s);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-extrabold text-slate-900">Admin Control Center</h1>
          </div>
          <p className="text-slate-600">Manage maternity centers, home nurses, and all platform bookings.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Total Centers</span>
              <Building className="w-4 h-4 text-primary-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{centers.length}</div>
          </div>

          <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-700">Pending Review</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-700">{pendingCenters.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Approved Centers</span>
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{approvedCenters.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Verified Nurses</span>
              <Stethoscope className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{nurses.filter(n => n.verificationStatus === "Approved").length}</div>
          </div>

          <button
            onClick={() => setActiveTab("bookings")}
            className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-sm hover:shadow-md hover:border-secondary-400 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 group-hover:text-secondary-600">Total Bookings</span>
              <Calendar className="w-4 h-4 text-secondary-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{bookings.length + nurseBookings.length}</div>
            <div className="text-xs text-secondary-500 mt-1 font-medium">Click to view →</div>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          {[
            { id: "centers", label: `Maternity Centers (${centers.length})`, icon: <Building className="w-4 h-4" /> },
            { id: "nurses", label: `Home Nurses (${nurses.length})`, icon: <Stethoscope className="w-4 h-4" /> },
            { id: "bookings", label: `Center Bookings (${bookings.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: "nursebookings", label: `Nurse Bookings (${nurseBookings.length})`, icon: <Home className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-5 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mr-3" /> Fetching admin data...
          </div>
        ) : activeTab === "centers" ? (
          /* ==================== CENTERS TAB ==================== */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Center Applications & Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage and register certified maternity hospitals</p>
              </div>
              <button
                onClick={() => { setFormError(""); setShowAddModal(true); }}
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
                      <td className="py-4 px-6"><StatusBadge status={center.status} /></td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {center.status === "Pending" ? (
                            <>
                              <button onClick={() => handleStatusUpdate(center._id, "Approved")} disabled={actionLoading === center._id} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center">
                                <Check className="w-3.5 h-3.5 mr-1" /> Approve
                              </button>
                              <button onClick={() => handleStatusUpdate(center._id, "Rejected")} disabled={actionLoading === center._id} className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors flex items-center">
                                <X className="w-3.5 h-3.5 mr-1" /> Reject
                              </button>
                            </>
                          ) : center.status === "Approved" ? (
                            <button onClick={() => handleStatusUpdate(center._id, "Rejected")} disabled={actionLoading === center._id} className="text-xs text-rose-600 font-medium hover:underline px-2 py-1">Revoke</button>
                          ) : (
                            <button onClick={() => handleStatusUpdate(center._id, "Approved")} disabled={actionLoading === center._id} className="text-xs text-emerald-600 font-medium hover:underline px-2 py-1">Re-Approve</button>
                          )}
                          <button onClick={() => handleDeleteCenter(center._id, center.centerName)} disabled={actionLoading === center._id} title="Delete Center" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1">
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

        ) : activeTab === "nurses" ? (
          /* ==================== NURSES TAB ==================== */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Home Nurse Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Verify nurse licenses and manage approved home care providers</p>
            </div>

            {nurses.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <div className="font-medium">No nurses registered yet</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-4 px-6">Nurse</th>
                      <th className="py-4 px-6">Qualification & License</th>
                      <th className="py-4 px-6">Specializations</th>
                      <th className="py-4 px-6">Rates</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {nurses.map((nurse) => (
                      <tr key={nurse._id} className="hover:bg-slate-50/60">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-base font-bold text-primary-600 border border-primary-200 flex-shrink-0">
                              {nurse.name?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{nurse.name}</div>
                              <div className="text-xs text-slate-500">{nurse.email}</div>
                              <div className="text-xs text-slate-500">{nurse.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-xs text-slate-700 font-medium max-w-[180px]">{nurse.qualification}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">{nurse.licenseNumber}</div>
                          <div className="text-xs text-secondary-600 mt-0.5">{nurse.experienceYears} yrs exp.</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {nurse.specializations?.slice(0, 3).map(s => (
                              <span key={s} className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">{s}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-slate-700">{nurse.rating?.toFixed(1)}</span>
                            <span className="text-xs text-slate-400">({nurse.totalReviews})</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-bold text-primary-600">₹{nurse.hourlyRate?.toLocaleString("en-IN")}/hr</div>
                          {nurse.dailyRate && <div className="text-xs text-slate-400">₹{nurse.dailyRate?.toLocaleString("en-IN")}/day</div>}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={nurse.verificationStatus} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {nurse.verificationStatus === "Pending" ? (
                              <>
                                <button onClick={() => handleNurseStatusUpdate(nurse._id, "Approved")} disabled={nurseActionLoading === nurse._id} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center">
                                  <Check className="w-3.5 h-3.5 mr-1" /> Approve
                                </button>
                                <button onClick={() => handleNurseStatusUpdate(nurse._id, "Rejected")} disabled={nurseActionLoading === nurse._id} className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors flex items-center">
                                  <X className="w-3.5 h-3.5 mr-1" /> Reject
                                </button>
                              </>
                            ) : nurse.verificationStatus === "Approved" ? (
                              <button onClick={() => handleNurseStatusUpdate(nurse._id, "Rejected")} disabled={nurseActionLoading === nurse._id} className="text-xs text-rose-600 font-medium hover:underline px-2 py-1">Revoke</button>
                            ) : (
                              <button onClick={() => handleNurseStatusUpdate(nurse._id, "Approved")} disabled={nurseActionLoading === nurse._id} className="text-xs text-emerald-600 font-medium hover:underline px-2 py-1">Re-Approve</button>
                            )}
                            <button onClick={() => handleDeleteNurse(nurse._id, nurse.name)} disabled={nurseActionLoading === nurse._id} title="Remove Nurse" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        ) : activeTab === "bookings" ? (
          /* ==================== CENTER BOOKINGS TAB ==================== */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">All Center Appointments</h2>
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
                    <button key={st} onClick={() => setBookingStatusFilter(st)} className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${bookingStatusFilter === st ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
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
                    <th className="py-4 px-6">Center & Service</th>
                    <th className="py-4 px-6">Appointment Date</th>
                    <th className="py-4 px-6">Fee</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400">
                        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <div className="font-medium">No appointments found</div>
                      </td>
                    </tr>
                  ) : filteredBookings.map((b) => (
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
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-xs">
                        {b.bookingDate ? (
                          <div>
                            <div className="font-semibold text-slate-800">{new Date(b.bookingDate).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</div>
                            <div className="text-slate-400">{new Date(b.bookingDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">₹{Number(b.service?.price || 0).toLocaleString("en-IN")}</td>
                      <td className="py-4 px-6"><StatusBadge status={b.bookingStatus || b.status} /></td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {(b.bookingStatus || b.status) === "Pending" && (
                            <>
                              <button onClick={() => handleBookingStatusUpdate(b._id, "Accepted")} disabled={bookingActionLoading === b._id} className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors">Accept</button>
                              <button onClick={() => handleBookingStatusUpdate(b._id, "Rejected")} disabled={bookingActionLoading === b._id} className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors">Reject</button>
                            </>
                          )}
                          {(b.bookingStatus || b.status) === "Accepted" && (
                            <button onClick={() => handleBookingStatusUpdate(b._id, "Completed")} disabled={bookingActionLoading === b._id} className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors">Complete</button>
                          )}
                          <select value={b.bookingStatus || b.status} onChange={(e) => handleBookingStatusUpdate(b._id, e.target.value)} disabled={bookingActionLoading === b._id} className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium focus:outline-none">
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        ) : (
          /* ==================== NURSE BOOKINGS TAB ==================== */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">All Home Nurse Bookings</h2>
                <p className="text-slate-500 text-xs mt-0.5">Manage nurse visit requests and track home care bookings</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search patient, nurse, or city..."
                  value={nurseBookingSearch}
                  onChange={(e) => setNurseBookingSearch(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full sm:w-64"
                />
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs">
                  {["All", "Pending", "Accepted", "Rejected", "Completed"].map((st) => (
                    <button key={st} onClick={() => setNurseBookingStatusFilter(st)} className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${nurseBookingStatusFilter === st ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
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
                    <th className="py-4 px-6">Nurse</th>
                    <th className="py-4 px-6">Shift & Dates</th>
                    <th className="py-4 px-6">Home Address</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredNurseBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400">
                        <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <div className="font-medium">No nurse bookings found</div>
                      </td>
                    </tr>
                  ) : filteredNurseBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{b.user?.name || "Patient"}</div>
                        <div className="text-xs text-slate-500">{b.user?.email}</div>
                        {b.patientPhone && (
                          <div className="text-[11px] text-slate-500 mt-0.5">📱 {b.patientPhone}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{b.nurse?.name || "—"}</div>
                        <div className="text-xs text-slate-500">{b.nurse?.phone}</div>
                        {b.deliveryType && b.deliveryType !== "Not Applicable" && (
                          <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-0.5 inline-block">{b.deliveryType}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <div className="font-semibold text-slate-800">{b.shiftType}</div>
                        <div className="text-slate-500 mt-0.5">
                          {b.startDate && new Date(b.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          {" – "}
                          {b.endDate && new Date(b.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <div className="text-slate-700">{b.homeAddress?.street}</div>
                        <div className="text-slate-500">{b.homeAddress?.city}{b.homeAddress?.pincode ? ` – ${b.homeAddress.pincode}` : ""}</div>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">₹{Number(b.totalAmount || 0).toLocaleString("en-IN")}</td>
                      <td className="py-4 px-6"><StatusBadge status={b.bookingStatus} /></td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {b.bookingStatus === "Pending" && (
                            <>
                              <button onClick={() => handleNurseBookingStatusUpdate(b._id, "Accepted")} disabled={nurseBookingActionLoading === b._id} className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors">Accept</button>
                              <button onClick={() => handleNurseBookingStatusUpdate(b._id, "Rejected")} disabled={nurseBookingActionLoading === b._id} className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors">Reject</button>
                            </>
                          )}
                          {b.bookingStatus === "Accepted" && (
                            <button onClick={() => handleNurseBookingStatusUpdate(b._id, "Completed")} disabled={nurseBookingActionLoading === b._id} className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors">Complete</button>
                          )}
                          <select value={b.bookingStatus} onChange={(e) => handleNurseBookingStatusUpdate(b._id, e.target.value)} disabled={nurseBookingActionLoading === b._id} className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium focus:outline-none">
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Maternity Center Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden relative border border-slate-100 my-auto">
              <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Add New Maternity Center</h3>
                    <p className="text-xs text-slate-500">Register a center directly and create provider credentials</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCenterSubmit} className="p-6 overflow-y-auto space-y-4">
                {formError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm font-medium">{formError}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "centerName", label: "Center Name *", placeholder: "e.g. Blossom Maternity Care", required: true },
                    { name: "ownerName", label: "Owner / Lead Doctor Name *", placeholder: "e.g. Dr. Sarah Jenkins", required: true },
                    { name: "email", label: "Official Email *", placeholder: "provider@blossom.com", required: true, type: "email" },
                    { name: "phone", label: "Phone Number *", placeholder: "+91 98765 43210", required: true },
                    { name: "location", label: "City / Location *", placeholder: "e.g. Kochi, Kerala", required: true },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{f.label}</label>
                      <input type={f.type || "text"} name={f.name} required={f.required} placeholder={f.placeholder} value={formData[f.name]} onChange={handleInputChange} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Approval Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-slate-800">
                      <option value="Approved">Approved (Immediate Live)</option>
                      <option value="Pending">Pending Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
                  <input type="text" name="address" required placeholder="e.g. 450 Healthcare Ave, Suite 200" value={formData.address} onChange={handleInputChange} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Provider Login Password</label>
                  <input type="text" name="password" placeholder="Default: provider123" value={formData.password} onChange={handleInputChange} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Facilities</label>
                  <textarea rows={3} name="description" placeholder="Describe services, water birth suites, NICU level, neonatal nursing, etc." value={formData.description} onChange={handleInputChange} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={submittingCenter} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-70">
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
