import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, ArrowLeft } from "lucide-react";
import { RatingStars } from "../components/RatingStars";
import { StatusBadge } from "../components/StatusBadge";
import { motion } from "framer-motion";
import { api } from "../services/api";

const CenterList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch centers whenever search term or location changes
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchCenters = async () => {
        setLoading(true);
        try {
          const params = {};
          if (searchTerm) params.search = searchTerm.trim();
          if (locationFilter && locationFilter !== "All Locations") params.location = locationFilter;
          const res = await api.get("/centers", { params });
          setCenters(res.data || []);
        } catch (err) {
          console.error("Error fetching centers:", err);
          setCenters([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCenters();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, locationFilter]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-500 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Maternity Centers Directory</h1>
          <p className="text-slate-600 text-lg">Browse certified birthing suites and specialized maternity hospitals.</p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-2xl mb-10 flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 h-12"
            />
          </div>
          <div className="md:w-64 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input-field pl-12 h-12 appearance-none"
            >
              <option>All Locations</option>
              <option>San Francisco, CA</option>
              <option>Chicago, IL</option>
              <option>Austin, TX</option>
              <option>New York, NY</option>
              <option>Los Angeles, CA</option>
              <option>Seattle, WA</option>
              <option>Miami, FL</option>
              <option>Denver, CO</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <span>Loading centers...</span>
          </div>
        ) : centers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {centers.map((center, index) => (
              <motion.div
                key={center._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-md border border-primary-100 hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{center.centerName}</h2>
                    <div className="flex items-center text-slate-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                      {center.location}
                    </div>
                  </div>
                  <StatusBadge status={center.status} />
                </div>
                <div className="mb-4">
                  <RatingStars rating={center.rating} />
                </div>
                <p className="text-slate-600 mb-6 flex-grow">{center.description}</p>
                <div className="mt-auto">
                  <Link to={`/centers/${center._id}`} className="btn-secondary w-full text-center block">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">No maternity centers found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default CenterList;
