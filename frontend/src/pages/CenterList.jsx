import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowLeft } from "lucide-react";
import { RatingStars } from "../components/RatingStars";
import { StatusBadge } from "../components/StatusBadge";
import { motion } from "framer-motion";

const mockCenters = [
  {
    id: 1,
    name: "Blossom Motherhood & Birthing Suite",
    location: "San Francisco, CA",
    description: "Luxury natural birth suites, 24/7 obstetricians, water birth tubs, and postpartum confinement care.",
    rating: 4.9,
    status: "Approved"
  },
  {
    id: 2,
    name: "St. Jude Women & Infant Care Center",
    location: "Chicago, IL",
    description: "Level III NICU, comprehensive high-risk pregnancy management, fetal cardiology & ultrasound.",
    rating: 4.8,
    status: "Approved"
  },
  {
    id: 3,
    name: "Serenity Maternity & Postnatal Haven",
    location: "Austin, TX",
    description: "Postpartum nursing retreat, lactation consultants, maternal mental wellness counseling, newborn nutrition.",
    rating: 5.0,
    status: "Approved"
  },
  {
    id: 4,
    name: "Grace Family Birthing Hospital",
    location: "New York, NY",
    description: "Comprehensive prenatal diagnostics, painless epidural labor suites, and 24/7 emergency OB/GYN response.",
    rating: 4.7,
    status: "Approved"
  },
  {
    id: 5,
    name: "Lumina Women's Health & Delivery",
    location: "Los Angeles, CA",
    description: "Premium maternal care focusing on holistic wellness, customized birth plans, and advanced prenatal genetics.",
    rating: 4.9,
    status: "Approved"
  },
  {
    id: 6,
    name: "Nurture Care Maternity Home",
    location: "Seattle, WA",
    description: "Cozy, home-like birthing environment with highly experienced midwives and comprehensive doula support.",
    rating: 4.8,
    status: "Approved"
  },
  {
    id: 7,
    name: "Sunrise Neonatal & Birthing Institute",
    location: "Miami, FL",
    description: "Specialized in high-risk pregnancies with an award-winning Level IV NICU and dedicated maternal-fetal medicine specialists.",
    rating: 4.9,
    status: "Premium"
  },
  {
    id: 8,
    name: "Harmony Family Birthing Suites",
    location: "Denver, CO",
    description: "Eco-friendly birthing center offering water births, hypnobirthing classes, and postpartum family integration.",
    rating: 4.7,
    status: "Approved"
  }
];

const CenterList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredCenters = mockCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          center.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "All Locations" || center.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

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

        {/* Center List */}
        {filteredCenters.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCenters.map((center, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={center.id} 
              className="bg-white p-6 rounded-2xl shadow-md border border-primary-100 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{center.name}</h2>
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
                <Link to={`/centers/${center.id}`} className="btn-secondary w-full text-center block">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No maternity centers found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterList;
