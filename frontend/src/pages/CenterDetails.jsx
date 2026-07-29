import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import { RatingStars } from "../components/RatingStars";
import { BookingModal } from "../components/BookingModal";
import { motion } from "framer-motion";

const mockCenters = {
  "1": {
    name: "Blossom Motherhood & Birthing Suite",
    rating: 4.9,
    reviews: 0,
    description: "State-of-the-art maternity hospital specializing in natural water birth suites, painless labor care, level III NICU, and luxurious postnatal confinement suites.",
    address: "450 Healthcare Ave, Suite 200, San Francisco, CA",
    phone: "+1 (415) 555-0192",
    email: "contact@blossommaternity.care",
  },
  "2": {
    name: "St. Jude Women & Infant Care Center",
    rating: 4.8,
    reviews: 0,
    description: "Level III NICU, comprehensive high-risk pregnancy management, fetal cardiology & ultrasound.",
    address: "1200 Hope Blvd, Chicago, IL",
    phone: "+1 (312) 555-0921",
    email: "care@stjude-infant.care",
  },
  "3": {
    name: "Serenity Maternity & Postnatal Haven",
    rating: 5.0,
    reviews: 0,
    description: "Postpartum nursing retreat, lactation consultants, maternal mental wellness counseling, newborn nutrition.",
    address: "44 Wellness Way, Austin, TX",
    phone: "+1 (512) 555-7732",
    email: "hello@serenityhaven.com",
  },
  "4": {
    name: "Grace Family Birthing Hospital",
    rating: 4.7,
    reviews: 0,
    description: "Comprehensive prenatal diagnostics, painless epidural labor suites, and 24/7 emergency OB/GYN response.",
    address: "888 Madison Ave, New York, NY",
    phone: "+1 (212) 555-8891",
    email: "info@gracefamily.nyc",
  },
  "5": {
    name: "Lumina Women's Health & Delivery",
    rating: 4.9,
    reviews: 0,
    description: "Premium maternal care focusing on holistic wellness, customized birth plans, and advanced prenatal genetics.",
    address: "7700 Sunset Blvd, Los Angeles, CA",
    phone: "+1 (310) 555-1200",
    email: "contact@luminawomens.com",
  },
  "6": {
    name: "Nurture Care Maternity Home",
    rating: 4.8,
    reviews: 0,
    description: "Cozy, home-like birthing environment with highly experienced midwives and comprehensive doula support.",
    address: "204 Pine St, Seattle, WA",
    phone: "+1 (206) 555-4309",
    email: "hello@nurturecare.com",
  },
  "7": {
    name: "Sunrise Neonatal & Birthing Institute",
    rating: 4.9,
    reviews: 0,
    description: "Specialized in high-risk pregnancies with an award-winning Level IV NICU and dedicated maternal-fetal medicine specialists.",
    address: "100 Ocean Drive, Miami, FL",
    phone: "+1 (305) 555-7650",
    email: "care@sunriseneonatal.org",
  },
  "8": {
    name: "Harmony Family Birthing Suites",
    rating: 4.7,
    reviews: 0,
    description: "Eco-friendly birthing center offering water births, hypnobirthing classes, and postpartum family integration.",
    address: "300 Mountain View Rd, Denver, CO",
    phone: "+1 (303) 555-9011",
    email: "info@harmonybirth.co",
  }
};

const mockServices = [
  { id: 1, name: "Prenatal Health & Sonography Package", price: 2500, duration: "45 mins", desc: "Full fetal anatomy scan, maternal health assessment, and ultrasound recording." },
  { id: 2, name: "Luxury Water Birth Delivery Suite", price: 45000, duration: "24 Hours Care", desc: "Private birthing tub, personal midwife, obstetrician on standby, and care kit." },
  { id: 3, name: "Postnatal Lactation & Newborn Nursing", price: 3500, duration: "60 mins", desc: "Certified lactation nurse consultation, infant attachment guidance." }
];

const CenterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const center = mockCenters[id] || mockCenters["1"];
  
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleBook = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-primary-100 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{center.name}</h1>
          <div className="mb-6">
            <RatingStars rating={center.rating} showCount={true} totalReviews={center.reviews} />
          </div>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-3xl">{center.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-slate-600 border-t border-slate-100 pt-6 mt-6">
            <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-primary-500" /> {center.address}</div>
            <div className="flex items-center"><Phone className="w-5 h-5 mr-2 text-primary-500" /> {center.phone}</div>
            <div className="flex items-center"><Mail className="w-5 h-5 mr-2 text-primary-500" /> {center.email}</div>
          </div>
        </div>

        {/* Services & Pricing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Services & Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mockServices.map((service, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={service.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-primary-100 hover:border-primary-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 pr-4">{service.name}</h3>
                    <div className="text-primary-600 font-bold whitespace-nowrap">₹{service.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-sm font-medium text-slate-500 mb-3">{service.duration}</div>
                  <p className="text-slate-600 text-sm mb-6">{service.desc}</p>
                </div>
                <button onClick={() => handleBook(service)} className="btn-primary w-full mt-auto">
                  Book Appointment
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-primary-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Patient Reviews</h2>
          
          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Write a review</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                <select className="input-field max-w-xs">
                  <option>5 - Excellent</option>
                  <option>4 - Very Good</option>
                  <option>3 - Good</option>
                  <option>2 - Fair</option>
                  <option>1 - Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
                <textarea 
                  rows="3" 
                  placeholder="Share your experience..." 
                  className="input-field resize-none"
                ></textarea>
              </div>
              <button type="button" className="btn-secondary">Submit Review</button>
            </form>
          </div>
          
          <div className="text-center py-8 text-slate-500">
            No reviews yet. Be the first to share your experience.
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal 
          center={center} 
          service={selectedService} 
          onClose={() => setShowBookingModal(false)} 
        />
      )}
    </div>
  );
};

export default CenterDetails;
