import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCentersApi } from "../services/api";
import { RatingStars } from "../components/RatingStars";
import { Search, MapPin, Building2, Phone, Filter, Sparkles, ChevronRight } from "lucide-react";

export const CenterList = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState("all");

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await getCentersApi();
        setCenters(data);
      } catch (error) {
        console.error("Failed to fetch centers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const sampleCenters = [
    {
      _id: "center1",
      centerName: "Blossom Motherhood & Birthing Suite",
      location: "San Francisco, CA",
      address: "450 Healthcare Ave, Suite 200",
      phone: "+1 (415) 555-0192",
      description: "Luxury natural birth suites, 24/7 obstetricians, water birth tubs, and postpartum confinement care.",
      status: "Approved",
      rating: 4.9,
    },
    {
      _id: "center2",
      centerName: "St. Jude Women & Infant Care Center",
      location: "Chicago, IL",
      address: "120 Park Ridge Blvd",
      phone: "+1 (312) 555-0843",
      description: "Level III NICU, comprehensive high-risk pregnancy management, fetal cardiology & ultrasound.",
      status: "Approved",
      rating: 4.8,
    },
    {
      _id: "center3",
      centerName: "Serenity Maternity & Postnatal Haven",
      location: "Austin, TX",
      address: "880 Oakridge Lane",
      phone: "+1 (512) 555-0311",
      description: "Postpartum nursing retreat, lactation consultants, maternal mental wellness counseling, newborn nutrition.",
      status: "Approved",
      rating: 5.0,
    },
    {
      _id: "center4",
      centerName: "Grace Family Birthing Hospital",
      location: "New York, NY",
      address: "710 East 64th Street",
      phone: "+1 (212) 555-9012",
      description: "Comprehensive prenatal diagnostics, painless epidural labor suites, and 24/7 emergency OB/GYN response.",
      status: "Approved",
      rating: 4.7,
    },
  ];

  const allCenters = centers.length > 0 ? centers : sampleCenters;

  const locations = ["all", ...new Set(allCenters.map((c) => c.location).filter(Boolean))];

  const filteredCenters = allCenters.filter((c) => {
    const matchesSearch =
      (c.centerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "all" || c.location === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER BANNER */}
      <div className="space-y-4 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Explore Maternity Centers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Browse certified birthing suites, specialized maternity hospitals, and postnatal wellness retreats.
        </p>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex items-center flex-1 w-full">
          <Search className="w-5 h-5 text-rose-500 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search by center name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm font-semibold outline-none focus:border-rose-500 w-full sm:w-auto"
          >
            <option value="all">All Locations</option>
            {locations.filter((l) => l !== "all").map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RESULTS LISTING */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-500">Loading Maternity Centers...</p>
        </div>
      ) : filteredCenters.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold">No Maternity Centers Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any centers matching your search criteria. Try adjusting your search query or location filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCenters.map((center) => (
            <div
              key={center._id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 space-y-5 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <RatingStars rating={center.rating || 4.9} />
                </div>

                <div>
                  <h3 className="text-xl font-bold group-hover:text-rose-600 transition-colors">
                    {center.centerName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{center.location || "City Location"}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {center.description || "Certified maternity care provider offering comprehensive labor, prenatal checkups, and infant care."}
                </p>

                <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-rose-500" />
                    <span>{center.phone || "+1 (800) 555-CARE"}</span>
                  </div>
                  {center.address && (
                    <div className="text-slate-400 truncate">Address: {center.address}</div>
                  )}
                </div>
              </div>

              <Link
                to={`/centers/${center._id}`}
                className="btn btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 group-hover:shadow-lg transition-shadow"
              >
                View Services & Book <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
