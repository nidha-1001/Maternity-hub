import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCenterByIdApi, getServicesApi, getReviewsApi, addReviewApi, addServiceApi } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { RatingStars } from "../components/RatingStars";
import { BookingModal } from "../components/BookingModal";
import { formatCurrency } from "../utils/helpers";
import { Building2, MapPin, Phone, Mail, Clock, Plus, Star, Calendar, CheckCircle2, MessageSquare, AlertCircle, ArrowLeft } from "lucide-react";

export const CenterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [center, setCenter] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected service for booking modal
  const [selectedService, setSelectedService] = useState(null);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  // Add Service Form state (for center owner / admin)
  const [showAddService, setShowAddService] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [centerRes, servicesRes, reviewsRes] = await Promise.allSettled([
        getCenterByIdApi(id),
        getServicesApi(id),
        getReviewsApi(id),
      ]);

      if (centerRes.status === "fulfilled") setCenter(centerRes.value.data);
      if (servicesRes.status === "fulfilled") setServices(servicesRes.value.data);
      if (reviewsRes.status === "fulfilled") setReviews(reviewsRes.value.data);
    } catch (err) {
      console.error("Error loading center details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setReviewSubmitting(true);
    try {
      await addReviewApi({
        center: id,
        rating: Number(rating),
        comment,
      });

      setReviewMsg("Review posted successfully!");
      setComment("");
      // Refresh reviews
      const { data } = await getReviewsApi(id);
      setReviews(data);
    } catch (err) {
      setReviewMsg("Failed to add review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await addServiceApi({
        center: id,
        serviceName,
        price: Number(servicePrice),
        duration: serviceDuration,
        description: serviceDesc,
      });
      setShowAddService(false);
      setServiceName("");
      setServicePrice("");
      setServiceDuration("");
      setServiceDesc("");
      const { data } = await getServicesApi(id);
      setServices(data);
    } catch (err) {
      alert("Failed to add service.");
    }
  };

  // Fallback mock services if db has 0 services for this center
  const sampleServices = [
    {
      _id: "s1",
      serviceName: "Prenatal Health & Sonography Package",
      price: 2500,
      duration: "45 mins",
      description: "Full fetal anatomy scan, maternal health assessment, and 4D ultrasound recording.",
    },
    {
      _id: "s2",
      serviceName: "Luxury Water Birth Delivery Suite",
      price: 45000,
      duration: "24 Hours Care",
      description: "Private birthing tub, personal midwife, obstetrician on standby, and organic newborn care kit.",
    },
    {
      _id: "s3",
      serviceName: "Postnatal Lactation & Newborn Nursing",
      price: 3500,
      duration: "60 mins",
      description: "Certified lactation nurse consultation, infant attachment guidance, and maternal nutrition plan.",
    },
  ];

  const displayedServices = services.length > 0 ? services : sampleServices;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : (center?.rating || 4.9);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading Center Info...</p>
      </div>
    );
  }

  const currentCenter = center || {
    _id: id,
    centerName: "Blossom Motherhood & Birthing Suite",
    ownerName: "Dr. Sarah Jenkins",
    email: "contact@blossommaternity.care",
    phone: "+1 (415) 555-0192",
    address: "450 Healthcare Ave, Suite 200",
    location: "San Francisco, CA",
    description: "State-of-the-art maternity hospital specializing in natural water birth suites, painless labor care, level III NICU, and luxurious postnatal confinement suites.",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* BACK BUTTON */}
      <Link to="/centers" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Centers List
      </Link>

      {/* CENTER HERO CARD */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl space-y-6 relative overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-rose-500/30">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold">{currentCenter.centerName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm font-semibold">
                <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {currentCenter.location}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">Director: {currentCenter.ownerName}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 border border-rose-200/50 dark:border-rose-900/50">
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-rose-600 dark:text-rose-400">{averageRating}</span>
              <RatingStars rating={averageRating} showCount={false} />
            </div>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-4 text-xs text-slate-500 font-semibold">
              <p>{reviews.length} Verified Reviews</p>
              <p className="text-emerald-600 font-bold">100% Certified Care</p>
            </div>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {currentCenter.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{currentCenter.address}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Phone className="w-4 h-4 text-teal-500 shrink-0" />
            <span>{currentCenter.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Mail className="w-4 h-4 text-purple-500 shrink-0" />
            <span>{currentCenter.email}</span>
          </div>
        </div>
      </div>

      {/* OFFERED SERVICES SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Available Maternity Services</h2>
            <p className="text-sm text-slate-500">Select a service to schedule your appointment</p>
          </div>
          {(user?.role === "admin" || user?.email === currentCenter.email) && (
            <button
              onClick={() => setShowAddService(!showAddService)}
              className="btn btn-secondary text-xs"
            >
              <Plus className="w-4 h-4" /> Add New Service
            </button>
          )}
        </div>

        {/* ADD SERVICE FORM (IF OPEN) */}
        {showAddService && (
          <form onSubmit={handleAddServiceSubmit} className="glass-card p-6 rounded-2xl space-y-4 border border-teal-200 dark:border-teal-900">
            <h4 className="font-bold text-lg text-teal-600">Add New Service to Center</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
              />
              <input
                type="number"
                required
                placeholder="Price (INR)"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                className="p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 45 mins)"
                value={serviceDuration}
                onChange={(e) => setServiceDuration(e.target.value)}
                className="p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Service description..."
              value={serviceDesc}
              onChange={(e) => setServiceDesc(e.target.value)}
              className="w-full p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddService(false)} className="btn btn-ghost text-xs">
                Cancel
              </button>
              <button type="submit" className="btn btn-secondary text-xs">
                Publish Service
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedServices.map((service) => (
            <div
              key={service._id}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg leading-snug">{service.serviceName}</h3>
                  <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 shrink-0">
                    {formatCurrency(service.price)}
                  </span>
                </div>
                {service.duration && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {service.duration}
                  </span>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                  } else {
                    setSelectedService(service);
                  }
                }}
                className="btn btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS & RATINGS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        
        {/* REVIEWS LIST */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-rose-500" /> Patient Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="glass-card p-6 text-center text-sm text-slate-500">
              No reviews submitted yet for this center. Be the first to share your experience!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="glass-card p-5 rounded-2xl space-y-2 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{rev.user?.name || "Patient"}</span>
                    <RatingStars rating={rev.rating} showCount={false} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WRITE REVIEW CARD */}
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-bold text-lg">Leave a Review</h3>

            {reviewMsg && (
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 p-2.5 rounded-lg">
                {reviewMsg}
              </p>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-2.5 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                  <option value={2}>⭐⭐ (2/5 Poor)</option>
                  <option value={1}>⭐ (1/5 Terribile)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Your Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about the doctors, facilities, and birthing care..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="btn btn-primary w-full py-2.5 text-xs font-bold"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* BOOKING MODAL */}
      {selectedService && (
        <BookingModal
          center={currentCenter}
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSuccess={() => navigate("/my-bookings")}
        />
      )}
    </div>
  );
};
