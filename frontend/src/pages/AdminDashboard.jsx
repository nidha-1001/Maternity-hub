import React, { useEffect, useState } from "react";
import { getAdminDashboardApi, getCentersApi, updateCenterStatusApi, getBookingsApi } from "../services/api";
import { StatusBadge } from "../components/StatusBadge";
import { Users, Building2, Calendar, ShieldCheck, RefreshCw } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalCenters: 0, totalBookings: 0 });
  const [centers, setCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("centers");

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
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-sky-200 bg-sky-50 dark:bg-sky-900/20 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-xs font-semibold tracking-wide mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">System Dashboard</h1>
        </div>

        <button
          onClick={fetchAdminData}
          className="btn btn-outline text-xs px-4 py-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
        </button>
      </div>

      {/* METRICS STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Users", val: stats.totalUsers, icon: Users },
          { label: "Maternity Centers", val: stats.totalCenters, icon: Building2 },
          { label: "Total Appointments", val: stats.totalBookings, icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="ui-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pt-4">
        <button
          onClick={() => setActiveTab("centers")}
          className={`pb-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "centers"
              ? "border-slate-900 text-slate-900 dark:border-white dark:text-white"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Centers
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "bookings"
              ? "border-slate-900 text-slate-900 dark:border-white dark:text-white"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Bookings
        </button>
      </div>

      {/* DATA TABLES */}
      <div className="ui-card overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "centers" && (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Center Name</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Location</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Director</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {centers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No centers registered yet.
                    </td>
                  </tr>
                ) : (
                  centers.map((center) => (
                    <tr key={center._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{center.centerName}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {center.location || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 dark:text-white">{center.ownerName || "Director"}</div>
                        <div className="text-xs text-slate-500">{center.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={center.status || "Approved"} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(center._id, "Approved")}
                            className="btn btn-primary text-xs px-3 py-1.5"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(center._id, "Rejected")}
                            className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs px-3 py-1.5"
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
          )}

          {activeTab === "bookings" && (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Patient Name</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Service</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Center</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Booking Date</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No booking records found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{b.user?.name || "Patient"}</div>
                        <div className="text-xs text-slate-500">{b.user?.phone}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {b.service?.serviceName || "Maternity Service"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {b.center?.centerName || "Center"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "Scheduled"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusBadge status={b.bookingStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
