import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCentersApi } from "../services/api";
import { RatingStars } from "../components/RatingStars";
import { BackButton } from "../components/BackButton";
import { Search, MapPin, Building2, Filter, ChevronRight } from "lucide-react";

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
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 w-full">
      <BackButton />

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Maternity Centers Directory
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Browse certified birthing suites and specialized maternity hospitals.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-2 mb-12">
        <div className="flex-1 flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-3 w-full">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search centers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-64 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-transparent border-none outline-none py-2.5 px-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="all">All Locations</option>
            {locations.filter((l) => l !== "all").map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RESULTS LISTING */}
      {loading ? (
        <div className="flex justify-center py-20 text-slate-500 text-sm">
          Loading directory...
        </div>
      ) : filteredCenters.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No centers found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Adjust your search or filter to see more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <div
              key={center._id}
              className="ui-card flex flex-col justify-between p-6 h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <RatingStars rating={center.rating || 4.9} />
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1 leading-tight">
                  {center.centerName}
                </h3>
                
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  {center.location}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                  {center.description}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {center.status || "Verified"}
                </span>
                <Link
                  to={`/centers/${center._id}`}
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:hover:text-sky-400 flex items-center gap-1"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
