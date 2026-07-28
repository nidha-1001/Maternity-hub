import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCentersApi } from "../services/api";
import { RatingStars } from "../components/RatingStars";
import { Search, MapPin, Sparkles, Building2, HeartHandshake, ShieldCheck, Calendar, ArrowRight, UserCheck, Star, Activity } from "lucide-react";
import { motion } from "framer-motion";

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
    navigate(`/centers?search=${encodeURIComponent(searchQuery)}`);
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
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Decorative Glowing Blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-300/40 via-purple-300/30 to-teal-300/30 blur-3xl rounded-full pointer-events-none -z-10 dark:from-rose-900/20 dark:via-purple-900/20 dark:to-teal-900/20" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-rose-200/60 dark:border-rose-900/60 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Empowering Every Birth Journey
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Find & Book Certified <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
              Maternity Centers & Specialist Care
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Discover top-rated maternity hospitals, luxury birthing suites, prenatal experts, and postnatal care centers near you.
          </motion.p>

          {/* GLASS SEARCH BAR */}
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="glass-card p-3 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3 px-3 flex-1 w-full">
              <Search className="w-5 h-5 text-rose-500 shrink-0" />
              <input
                type="text"
                placeholder="Search by city, center name, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-base"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full sm:w-auto px-8 py-3.5">
              Explore Centers
            </button>
          </motion.form>

          {/* QUICK TRUST BADGES */}
          <div className="pt-4 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Verified Medical Staff
            </span>
            <span className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-500" /> 10,000+ Happy Mothers
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" /> Instant Online Booking
            </span>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Maternity Centers", val: "120+", icon: Building2, color: "text-rose-500" },
            { label: "Delivered Babies", val: "15,000+", icon: HeartHandshake, color: "text-teal-500" },
            { label: "Specialist Doctors", val: "450+", icon: UserCheck, color: "text-purple-500" },
            { label: "Care Satisfaction", val: "99.4%", icon: Star, color: "text-amber-500" },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-6 text-center space-y-2 hover:scale-[1.02] transition-transform">
              <stat.icon className={`w-8 h-8 mx-auto ${stat.color}`} />
              <h3 className="text-3xl font-bold">{stat.val}</h3>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED MATERNITY CENTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold">Top Featured Maternity Centers</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Top recommended maternity hospitals and birthing facilities with state-of-the-art infrastructure.
            </p>
          </div>
          <Link to="/centers" className="btn btn-outline flex items-center gap-2">
            View All Centers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedCenters.map((center) => (
            <div key={center._id} className="glass-card overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-6 space-y-4 border border-slate-200/80 dark:border-slate-800">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-lg">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <RatingStars rating={center.rating || 4.9} />
                </div>

                <div>
                  <h3 className="text-xl font-bold group-hover:text-rose-600 transition-colors">
                    {center.centerName}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {center.location}
                  </p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                  {center.description || "Comprehensive prenatal, birthing, and postnatal care center with modern equipment and compassionate care."}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Owner: {center.ownerName || "Certified Hospital"}</span>
                <Link to={`/centers/${center._id}`} className="btn btn-primary text-xs py-2 px-4">
                  View & Book Services
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARE SERVICES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-teal-500/10 p-8 sm:p-12 rounded-3xl border border-rose-200/50 dark:border-rose-900/50 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold">Comprehensive Maternity Care Services</h2>
          <p className="text-slate-600 dark:text-slate-300">
            From early trimester ultrasounds to 24/7 postnatal care, book individual specialist services easily.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Prenatal Consultations", desc: "Routine fetal monitoring, genetic screening, and maternal nutrition advice.", icon: Activity },
            { title: "Birthing Suites & Delivery", desc: "Private water birth suites, painless labor options, and OB/GYN specialists.", icon: HeartHandshake },
            { title: "Postnatal Rehabilitation", desc: "Lactation nursing, pelvic floor therapy, and postpartum wellness.", icon: ShieldCheck },
            { title: "Pediatric & NICU Care", desc: "Level III neonatal intensive care and pediatrician checkups.", icon: Sparkles },
          ].map((srv, idx) => (
            <div key={idx} className="glass-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100/70 dark:bg-slate-800 shadow flex items-center justify-center text-rose-500">
                <srv.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">{srv.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="glass-card p-10 sm:p-14 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold">Are You a Certified Maternity Center Owner?</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join MaternityHub to showcase your center, manage patient appointments, and publish your healthcare services to thousands of expectant families.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/register" className="btn btn-primary px-8 py-3.5 text-base">
              Register Center Now
            </Link>
            <Link to="/centers" className="btn btn-outline px-8 py-3.5 text-base">
              Browse Registered Centers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
