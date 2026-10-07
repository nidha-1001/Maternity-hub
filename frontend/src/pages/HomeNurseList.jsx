import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Star, MapPin, ShieldCheck, Stethoscope, Moon, Sun, Heart, X } from "lucide-react";
import { api } from "../services/api";
import { motion } from "framer-motion";
import NurseBookingModal from "../components/NurseBookingModal";

const SPECIALIZATIONS = [
  "All",
  "Newborn Care",
  "Postpartum Recovery",
  "Lactation Support",
  "C-Section Dressing",
  "Night Care",
  "Twin Care",
  "Neonatal Care",
];

const SPEC_ICONS = {
  "Newborn Care": "👶",
  "Postpartum Recovery": "💊",
  "Lactation Support": "🤱",
  "C-Section Dressing": "🩹",
  "Night Care": "🌙",
  "Twin Care": "👯",
  "Neonatal Care": "🏥",
};

const HomeNurseList = () => {
  const [searchParams] = useSearchParams();
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNurses();
  }, [search, selectedSpec]);

  const fetchNurses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedSpec !== "All") params.specialization = selectedSpec;
      const res = await api.get("/nurses", { params });
      setNurses(res.data || []);
    } catch (err) {
      console.error("Error fetching nurses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const openBooking = (nurse) => {
    setSelectedNurse(nurse);
    setShowBookingModal(true);
  };

  const getShiftIcon = (shift) => {
    if (shift.toLowerCase().includes("night")) return <Moon className="w-3 h-3" />;
    if (shift.toLowerCase().includes("24")) return <Heart className="w-3 h-3" />;
    return <Sun className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-14 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-60 h-60 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4 border border-white/30">
            <ShieldCheck className="w-4 h-4" /> All nurses are verified & licensed
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Professional Home Nurses<br />
            <span className="text-yellow-300">At Your Doorstep</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Certified postpartum nurses, lactation consultants & newborn care specialists available for home visits across India.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex max-w-xl mx-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, specialty, location..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-2xl text-sm transition-colors shadow-lg"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Specialization Filter Chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          {SPECIALIZATIONS.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                selectedSpec === spec
                  ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary-400 hover:text-primary-600"
              }`}
            >
              {spec !== "All" && SPEC_ICONS[spec] && <span className="mr-1">{SPEC_ICONS[spec]}</span>}
              {spec}
            </button>
          ))}
          {(search || selectedSpec !== "All") && (
            <button
              onClick={() => { setSearch(""); setSearchInput(""); setSelectedSpec("All"); }}
              className="px-4 py-2 rounded-full text-sm font-semibold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-sm text-slate-500 mb-5 font-medium">
            {nurses.length} verified nurse{nurses.length !== 1 ? "s" : ""} found
            {selectedSpec !== "All" && <span className="text-primary-600"> in {selectedSpec}</span>}
            {search && <span className="text-primary-600"> for "{search}"</span>}
          </p>
        )}

        {/* Nurse Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : nurses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No nurses found</h3>
            <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setSearch(""); setSearchInput(""); setSelectedSpec("All"); }}
              className="btn-primary"
            >
              View All Nurses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nurses.map((nurse, index) => (
              <motion.div
                key={nurse._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all group overflow-hidden flex flex-col"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 text-2xl font-bold text-primary-600 border border-primary-200">
                      {nurse.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-lg font-bold text-slate-900 truncate">{nurse.name}</h2>
                        {nurse.verificationStatus === "Approved" && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{nurse.qualification}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-800">{nurse.rating?.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({nurse.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience Badge */}
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-700 bg-secondary-50 px-2.5 py-1 rounded-full border border-secondary-200">
                      <Stethoscope className="w-3 h-3" /> {nurse.experienceYears} yrs exp.
                    </span>
                    {nurse.isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        ✓ Available
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">Unavailable</span>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">{nurse.bio}</p>
                </div>

                {/* Specializations */}
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {nurse.specializations?.slice(0, 3).map((spec) => (
                      <span key={spec} className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                        {SPEC_ICONS[spec]} {spec}
                      </span>
                    ))}
                    {nurse.specializations?.length > 3 && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                        +{nurse.specializations.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Locations */}
                {nurse.serviceLocations?.length > 0 && (
                  <div className="px-6 pb-4 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                    <span className="truncate">{nurse.serviceLocations.join(", ")}</span>
                  </div>
                )}

                {/* Shift Types */}
                <div className="px-6 pb-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {nurse.shiftTypes?.slice(0, 2).map((shift) => (
                      <span key={shift} className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        {getShiftIcon(shift)} {shift}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-auto px-6 pb-6 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-extrabold text-primary-600">₹{nurse.hourlyRate?.toLocaleString('en-IN')}<span className="text-sm font-normal text-slate-400">/hr</span></div>
                      {nurse.dailyRate && (
                        <div className="text-xs text-slate-400">₹{nurse.dailyRate?.toLocaleString('en-IN')}/day</div>
                      )}
                    </div>
                    <button
                      onClick={() => openBooking(nurse)}
                      disabled={!nurse.isAvailable}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                        nurse.isAvailable
                          ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white hover:shadow-md active:scale-95"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {nurse.isAvailable ? "Book Now" : "Unavailable"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedNurse && (
        <NurseBookingModal
          nurse={selectedNurse}
          onClose={() => { setShowBookingModal(false); setSelectedNurse(null); }}
          onSuccess={() => { setShowBookingModal(false); setSelectedNurse(null); }}
        />
      )}
    </div>
  );
};

export default HomeNurseList;
