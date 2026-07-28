import React, { useEffect, useState } from "react";
import { getAdminDashboardApi, getCentersApi, updateCenterStatusApi, getBookingsApi } from "../services/api";
import { StatusBadge } from "../components/StatusBadge";
import { Users, Building2, Calendar, ShieldCheck, CheckCircle2, XCircle, Clock, Search, RefreshCw } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalCenters: 0, totalBookings: 0 });
  const [centers, setCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("centers"); // "centers" or "bookings"

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, centersRes, bookingsRes] = await Promise.allSettled([
        getAdminDashboardApi(),
        getCentersApi(),
        getBookingsApi(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (centersRes.status === "fulfilled") setCenters(centersRes.value.data);
      if (bookingsRes.status === "fulfilled") setBookings(bookingsRes.value.data);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (centerId, newStatus) => {
    try {
      await updateCenterStatusApi(centerId, newStatus);
      fetchAdminData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> System Administrator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Admin Oversight Portal</h1>
        </div>

        <button
          onClick={fetchAdminData}
          className="btn btn-outline text-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh Data
        </button>
      </div>

      {/* METRICS STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-rose-200/50 dark:border-rose-900/50">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Total Registered Users</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-teal-200/50 dark:border-teal-900/50">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Maternity Centers</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats.totalCenters}</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-purple-200/50 dark:border-purple-900/50">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Total Appointments</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats.totalBookings}</h3>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("centers")}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === "centers"
              ? "border-rose-500 text-rose-600 dark:text-rose-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Manage Maternity Centers ({centers.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === "bookings"
              ? "border-rose-500 text-rose-600 dark:text-rose-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          All System Bookings ({bookings.length})
        </button>
      </div>

      {/* CENTER APPROVAL TABLE */}
      {activeTab === "centers" && (
        <div className="glass-card rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 dark:bg-slate-800/80 uppercase text-[11px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-4">Center Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Director / Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Approval Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {centers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No maternity centers registered yet.
                    </td>
                  </tr>
                ) : (
                  centers.map((center) => (
                    <tr key={center._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{center.centerName}</div>
                        <div className="text-xs text-slate-400 truncate max-w-xs">{center.description}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                        {center.location || "N/A"}
                      </td>
                      <td className="p-4 text-xs space-y-0.5">
                        <div className="font-bold">{center.ownerName || "Director"}</div>
                        <div className="text-slate-400">{center.phone}</div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={center.status || "Approved"} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(center._id, "Approved")}
                            className="btn btn-secondary text-[11px] py-1 px-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(center._id, "Rejected")}
                            className="btn btn-ghost text-[11px] py-1 px-3 text-rose-600 hover:bg-rose-50"
                          >
                            Reject
                          </button>
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

      {/* SYSTEM BOOKINGS TABLE */}
      {activeTab === "bookings" && (
        <div className="glass-card rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 dark:bg-slate-800/80 uppercase text-[11px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Center</th>
                  <th className="p-4">Booking Date</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No booking records found in the database.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{b.user?.name || "Patient"}</div>
                        <div className="text-xs text-slate-400">{b.user?.phone}</div>
                      </td>
                      <td className="p-4 font-semibold text-rose-600 dark:text-rose-400">
                        {b.service?.serviceName || "Maternity Service"}
                      </td>
                      <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                        {b.center?.centerName || "Center"}
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-500">
                        {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "Scheduled"}
                      </td>
                      <td className="p-4 text-right">
                        <StatusBadge status={b.bookingStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
