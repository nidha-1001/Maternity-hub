import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCenterByIdApi, getServicesApi, getReviewsApi, addReviewApi, addServiceApi } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { RatingStars } from "../components/RatingStars";
import { BookingModal } from "../components/BookingModal";
import { BackButton } from "../components/BackButton";
import { formatCurrency } from "../utils/helpers";
import { Building2, MapPin, Phone, Mail, Clock, Plus, Calendar, MessageSquare } from "lucide-react";

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
      description: "Full fetal anatomy scan, maternal health assessment, and ultrasound recording.",
    },
    {
      _id: "s2",
      serviceName: "Luxury Water Birth Delivery Suite",
      price: 45000,
      duration: "24 Hours Care",
      description: "Private birthing tub, personal midwife, obstetrician on standby, and care kit.",
    },
    {
      _id: "s3",
      serviceName: "Postnatal Lactation & Newborn Nursing",
      price: 3500,
      duration: "60 mins",
      description: "Certified lactation nurse consultation, infant attachment guidance.",
    },
  ];

  const displayedServices = services.length > 0 ? services : sampleServices;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : (center?.rating || 4.9);

  if (loading) {
    return (
      <div className="flex justify-center py-32 text-slate-500 text-sm">
        Loading center details...
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
    <div className="max-w-4xl mx-auto px-6 py-12 w-full">
      <BackButton />

      {/* HEADER INFO */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {currentCenter.centerName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={averageRating} showCount={false} />
              <span className="text-sm font-medium text-slate-500">
                ({reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          {currentCenter.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-slate-200 dark:border-slate-800 py-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{currentCenter.address}, {currentCenter.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{currentCenter.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{currentCenter.email}</span>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Services & Pricing</h2>
          {(user?.role === "admin" || user?.email === currentCenter.email) && (
            <button
              onClick={() => setShowAddService(!showAddService)}
              className="btn btn-outline py-1.5 px-3 text-xs"
            >
              <Plus className="w-3 h-3" /> Add Service
            </button>
          )}
        </div>

        {/* ADD SERVICE FORM */}
        {showAddService && (
          <form onSubmit={handleAddServiceSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-8 space-y-4">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">New Service</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
              <input
                type="number"
                required
                placeholder="Price (INR)"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
              />
              <input
                type="text"
                placeholder="Duration (e.g. 45 mins)"
                value={serviceDuration}
                onChange={(e) => setServiceDuration(e.target.value)}
              />
            </div>
            <textarea
              rows={2}
              placeholder="Service description..."
              value={serviceDesc}
              onChange={(e) => setServiceDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddService(false)} className="btn btn-ghost text-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-sm">
                Publish
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {displayedServices.map((service) => (
            <div
              key={service._id}
              className="ui-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{service.serviceName}</h3>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatCurrency(service.price)}
                  </span>
                </div>
                {service.duration && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <Clock className="w-3.5 h-3.5" /> {service.duration}
                  </div>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-400">
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
                className="btn btn-primary whitespace-nowrap text-sm shrink-0"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-400" /> Patient Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* WRITE REVIEW */}
          <div className="md:col-span-2">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">Write a review</h3>

              {reviewMsg && (
                <p className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950 p-2 rounded mb-4">
                  {reviewMsg}
                </p>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Comment</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="btn btn-secondary w-full text-sm"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>

          {/* REVIEWS LIST */}
          <div className="md:col-span-3 space-y-4">
            {reviews.length === 0 ? (
              <div className="text-sm text-slate-500 italic py-4">
                No reviews yet. Be the first to share your experience.
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="ui-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-slate-900 dark:text-white">
                      {rev.user?.name || "Patient"}
                    </span>
                    <RatingStars rating={rev.rating} showCount={false} />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
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
