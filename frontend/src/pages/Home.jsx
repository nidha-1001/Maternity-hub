import { motion } from "framer-motion";
import { Search, Building, Baby, Users, HeartPulse, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center px-4 py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
           <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-6"
          >
            Premium Maternity Care Network
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8"
          >
            Find & Book Certified <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Maternity Centers</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto"
          >
            Discover top-rated maternity centers and postnatal care experts. Built for a seamless and trustworthy experience.
          </motion.p>
          
          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-4 rounded-3xl max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 shadow-lg ring-2 ring-pink-400 ring-offset-2 ring-offset-primary-50"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search by city, center name..." 
                className="input-field pl-12 h-14 bg-white/70 border-none"
              />
            </div>
            <button className="btn-primary h-14 px-8 text-lg w-full sm:w-auto">
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/60 border-b border-primary-100 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-100">
             <div>
               <div className="text-4xl font-extrabold text-slate-900 mb-2">120+</div>
               <div className="text-slate-500 font-medium">Maternity Centers</div>
             </div>
             <div>
               <div className="text-4xl font-extrabold text-slate-900 mb-2">15,000+</div>
               <div className="text-slate-500 font-medium">Delivered Babies</div>
             </div>
             <div>
               <div className="text-4xl font-extrabold text-slate-900 mb-2">450+</div>
               <div className="text-slate-500 font-medium">Specialist Doctors</div>
             </div>
             <div>
               <div className="text-4xl font-extrabold text-slate-900 mb-2">99.4%</div>
               <div className="text-slate-500 font-medium">Care Satisfaction</div>
             </div>
           </div>
        </div>
      </section>
      
      {/* Featured Centers Section */}
      <section className="py-20 bg-primary-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Centers</h2>
              <p className="text-slate-600 max-w-2xl">Highly rated birthing facilities equipped with modern infrastructure.</p>
            </div>
            <Link to="/centers" className="text-primary-600 font-medium hover:text-primary-700 flex items-center mt-4 md:mt-0">
              View all centers <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Center Card 1 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-md border border-primary-100 flex flex-col justify-between h-full">
               <div>
                 <div className="flex justify-between items-start mb-4">
                   <div className="font-bold text-amber-500 text-lg flex items-center">⭐ 4.9</div>
                   <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">5.2 km away</div>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-6">Blossom Maternity Center</h3>
               </div>
               <Link to="/centers/1" className="text-primary-600 font-medium hover:text-primary-700 text-sm mt-auto">View full details →</Link>
            </motion.div>
            
            {/* Center Card 2 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-md border border-primary-100 flex flex-col justify-between h-full">
               <div>
                 <div className="flex justify-between items-start mb-4">
                   <div className="font-bold text-amber-500 text-lg flex items-center">⭐ 4.8</div>
                   <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">8.5 km away</div>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-6">St. Jude Postnatal Care</h3>
               </div>
               <Link to="/centers/2" className="text-primary-600 font-medium hover:text-primary-700 text-sm mt-auto">View full details →</Link>
            </motion.div>

            {/* Center Card 3 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-md border border-primary-100 flex flex-col justify-between h-full">
               <div>
                 <div className="flex justify-between items-start mb-4">
                   <div className="font-bold text-amber-500 text-lg flex items-center">⭐ 5.0</div>
                   <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">12.1 km away</div>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-6">Serenity Maternity Center</h3>
               </div>
               <Link to="/centers/3" className="text-primary-600 font-medium hover:text-primary-700 text-sm mt-auto">View full details →</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comprehensive Care */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Care</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">From early trimester ultrasounds to postnatal care, book individual specialist services instantly through our verified network.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
               <HeartPulse className="w-8 h-8 text-primary-500 mb-4" />
               <h3 className="text-lg font-bold text-slate-900 mb-2">Prenatal Consults</h3>
               <p className="text-slate-600 text-sm">Routine monitoring and genetic screening.</p>
            </div>
            <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
               <Building className="w-8 h-8 text-primary-500 mb-4" />
               <h3 className="text-lg font-bold text-slate-900 mb-2">Birthing Suites</h3>
               <p className="text-slate-600 text-sm">Private water birth suites and OB specialists.</p>
            </div>
            <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
               <Users className="w-8 h-8 text-primary-500 mb-4" />
               <h3 className="text-lg font-bold text-slate-900 mb-2">Postnatal Care</h3>
               <p className="text-slate-600 text-sm">Lactation nursing and postpartum wellness.</p>
            </div>
            <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
               <Baby className="w-8 h-8 text-primary-500 mb-4" />
               <h3 className="text-lg font-bold text-slate-900 mb-2">NICU Services</h3>
               <p className="text-slate-600 text-sm">Level III neonatal intensive care facilities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary-700 opacity-50 mix-blend-multiply"></div>
         <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Register Your Center</h2>
            <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">Join the MaternityHub network to showcase your facility and manage patient appointments seamlessly.</p>
            <Link to="/register" className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
              Create Provider Account
            </Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
