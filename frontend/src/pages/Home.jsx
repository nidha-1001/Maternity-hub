import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCentersApi } from "../services/api";
import { RatingStars } from "../components/RatingStars";
import { Search, MapPin, Building2, HeartHandshake, UserCheck, Star, Activity, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const Home = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedCenters = async () => {
      try {
        const { data } = await getCentersApi();
        setCenters(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load centers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedCenters();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/centers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const sampleCenters = [
    {
      _id: "center1",
      centerName: "Blossom Motherhood & Birthing Suite",
      location: "San Francisco, CA",
      address: "450 Healthcare Ave",
      description: "Luxury natural birth suites, 24/7 obstetricians, water birth tubs & hydrotherapy.",
      phone: "+1 415 555 0192",
      rating: 4.9,
    },
    {
      _id: "center2",
      centerName: "St. Jude Women & Infant Care",
      location: "Chicago, IL",
      address: "120 Park Ridge Blvd",
      description: "Level III NICU, comprehensive high-risk pregnancy care & prenatal yoga workshops.",
      phone: "+1 312 555 0843",
      rating: 4.8,
    },
    {
      _id: "center3",
      centerName: "Serenity Maternity & Postnatal Haven",
      location: "Austin, TX",
      address: "880 Oakridge Lane",
      description: "Postpartum confinement suites, lactation specialists, and maternal wellness retreat.",
      phone: "+1 512 555 0311",
      rating: 5.0,
    },
  ];

  const displayedCenters = centers.length > 0 ? centers : sampleCenters;

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950">
      
      {/* HERO SECTION */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-28 px-6 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-8">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Premium Maternity Care Network</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
          Find & Book Certified Maternity Centers
        </h1>

        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          Discover top-rated maternity hospitals, luxury birthing suites, and postnatal care experts. Built for a seamless and trustworthy experience.
        </p>

        {/* SEARCH BAR */}
        <form 
          onSubmit={handleSearchSubmit}
          className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-xl sm:rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center flex-1 px-4 py-1.5 w-full">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Search by city, center name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium"
            />
          </div>
          <button type="submit" className="btn btn-primary rounded-lg sm:rounded-full w-full sm:w-auto px-5 py-2 text-sm shrink-0">
            Search
          </button>
        </form>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Maternity Centers", val: "120+" },
              { label: "Delivered Babies", val: "15,000+" },
              { label: "Specialist Doctors", val: "450+" },
              { label: "Care Satisfaction", val: "99.4%" },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.val}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CENTERS */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Featured Centers</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Highly rated birthing facilities equipped with modern infrastructure.</p>
          </div>
          <Link to="/centers" className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            View all directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedCenters.map((center) => (
            <div key={center._id} className="ui-card flex flex-col p-5 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 px-2 py-1 rounded font-semibold text-xs border border-amber-100 dark:border-amber-900/50">
                  <Star className="w-3 h-3 fill-current" />
                  {center.rating || 4.9}
                </div>
              </div>
              
              <div className="mb-4 flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {center.centerName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {center.location}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {center.description}
                </p>
              </div>

              <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Link to={`/centers/${center._id}`} className="text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  View full details <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 w-full">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Comprehensive Care</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              From early trimester ultrasounds to postnatal care, book individual specialist services instantly through our verified network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { title: "Prenatal Consults", desc: "Routine monitoring and genetic screening.", icon: Activity },
              { title: "Birthing Suites", desc: "Private water birth suites and OB specialists.", icon: HeartHandshake },
              { title: "Postnatal Care", desc: "Lactation nursing and postpartum wellness.", icon: ShieldCheck },
              { title: "NICU Services", desc: "Level III neonatal intensive care facilities.", icon: Building2 },
            ].map((srv, idx) => (
              <div key={idx} className="flex flex-col text-center items-center">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 shadow-sm">
                  <srv.icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5 text-sm">{srv.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28 w-full text-center">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-10 md:p-16 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Register Your Center</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            Join the MaternityHub network to showcase your facility and manage patient appointments seamlessly.
          </p>
          <Link to="/register" className="btn btn-primary px-6 py-2.5 text-sm">
            Create Provider Account
          </Link>
        </div>
      </section>

    </div>
  );
};
