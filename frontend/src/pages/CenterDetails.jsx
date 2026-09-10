import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Clock, Calendar, ShieldCheck, Star, AlertCircle, MessageSquare } from "lucide-react";
import { RatingStars } from "../components/RatingStars";
import { BookingModal } from "../components/BookingModal";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { api } from "../services/api";

const CenterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCenterDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/centers/${id}`);
        setCenter(res.data);
      } catch (err) {
        console.error("Error fetching center details:", err);
        setError("Failed to load maternity center details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCenterDetail();
  }, [id]);

  const handleBook = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewMsg({ type: "error", text: "Please sign in to submit a review." });
      return;
    }
    if (!reviewComment.trim()) {
      setReviewMsg({ type: "error", text: "Please write a comment for your review." });
      return;
    }

    setSubmittingReview(true);
    setReviewMsg(null);
    try {
      const res = await api.post(`/centers/${id}/reviews`, {
        rating: Number(reviewRating),
        comment: reviewComment.trim()
      });

      // Update local center state with the newly posted review
      setCenter(prev => {
        if (!prev) return prev;
        const newReview = res.data?.review || {
          user: { name: user.name },
          rating: Number(reviewRating),
          comment: reviewComment.trim(),
          createdAt: new Date()
        };
        const updatedReviews = [newReview, ...(prev.reviews || []).filter(r => r.user?._id !== user._id)];
        return {
          ...prev,
          rating: res.data?.avgRating || prev.rating,
          reviewsCount: res.data?.reviewsCount || updatedReviews.length,
          reviews: updatedReviews
        };
      });

      setReviewComment("");
      setReviewMsg({ type: "success", text: "Review submitted successfully! Thank you for your feedback." });
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewMsg({ type: "error", text: err.response?.data?.message || "Failed to submit review." });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-24 bg-slate-200 rounded"></div>
          <div className="h-64 bg-white rounded-3xl p-8 border border-slate-100 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-16 bg-slate-200 rounded w-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-white rounded-2xl p-6 border border-slate-100"></div>
            <div className="h-48 bg-white rounded-2xl p-6 border border-slate-100"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Center Not Found</h2>
        <p className="text-slate-600 text-sm mb-6">{error || "The requested maternity center could not be found."}</p>
        <button onClick={() => navigate("/centers")} className="btn-primary">
          Back to Centers Directory
        </button>
      </div>
    );
  }

  const services = center.services || [];
  const reviews = center.reviews || [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-500 mb-8 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        
        {/* Center Header Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-primary-100 mb-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" /> Certified Maternity Facility
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{center.centerName}</h1>
            </div>
            
            <div className="flex items-center gap-3 bg-primary-50/60 px-4 py-2.5 rounded-2xl border border-primary-100">
              <div className="text-right">
                <div className="text-xl font-extrabold text-slate-900">{Number(center.rating || 4.8).toFixed(1)}</div>
                <div className="text-xs text-slate-500">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</div>
              </div>
              <RatingStars rating={center.rating || 4.8} />
            </div>
          </div>

          <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed max-w-3xl">
            {center.description}
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-600 border-t border-slate-100 pt-6 mt-6">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 text-primary-500 shrink-0 mt-0.5" /> 
              <span>{center.address} • <strong className="text-slate-800">{center.location}</strong></span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-primary-500 shrink-0" /> 
              <span>{center.phone || "+91 (Hospital Helpline)"}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-primary-500 shrink-0" /> 
              <span>{center.email}</span>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Available Maternity &amp; Postnatal Services</h2>
              <p className="text-slate-500 text-sm">Select a specialized care service or package to schedule an appointment.</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              {services.length} {services.length === 1 ? 'Service' : 'Services'}
            </span>
          </div>

          {services.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
              No services are currently listed for this center.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={service._id} 
                  className="bg-white p-6 rounded-3xl shadow-sm border border-primary-100 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900 pr-2">{service.serviceName}</h3>
                      <div className="text-primary-600 font-extrabold text-lg whitespace-nowrap">
                        ₹{Number(service.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg mb-3">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {service.duration || "Consultation"}
                    </div>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      {service.description || "Certified maternal health care package provided by specialist medical staff."}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleBook(service)} 
                    className="btn-primary w-full mt-auto py-3 font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Calendar className="w-4 h-4" /> Book Appointment
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-primary-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Patient Reviews &amp; Experiences</h2>
              <p className="text-slate-500 text-sm">Real experiences shared by mothers and families</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900 text-lg">{Number(center.rating || 4.8).toFixed(1)}</span>
              <span className="text-slate-400 text-sm">({reviews.length})</span>
            </div>
          </div>
          
          {/* Write Review Form */}
          <div className="bg-primary-50/60 rounded-2xl p-6 border border-primary-100 mb-10">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-500" /> Share Your Experience
            </h3>

            {reviewMsg && (
              <div className={`p-3 rounded-xl text-sm mb-4 ${reviewMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {reviewMsg.text}
              </div>
            )}

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Rating</label>
                    <select 
                      value={reviewRating} 
                      onChange={(e) => setReviewRating(e.target.value)} 
                      className="input-field max-w-xs h-10 text-sm font-medium"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 - Exceptional Care</option>
                      <option value={4}>⭐⭐⭐⭐ 4 - Very Good</option>
                      <option value={3}>⭐⭐⭐ 3 - Satisfactory</option>
                      <option value={2}>⭐⭐ 2 - Needs Improvement</option>
                      <option value={1}>⭐ 1 - Poor Experience</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Review</label>
                  <textarea 
                    rows="3" 
                    required
                    placeholder="Share how the doctors, nurses, and facilities supported your care..." 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="input-field resize-none text-sm"
                  ></textarea>
                </div>
                <button type="submit" disabled={submittingReview} className="btn-secondary py-2.5 px-6 text-sm font-bold">
                  {submittingReview ? "Submitting Review..." : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between text-sm text-slate-600 bg-white/70 p-4 rounded-xl border border-primary-100">
                <span>Please sign in to share your experience with this maternity center.</span>
                <Link to="/login" className="btn-secondary text-xs px-4 py-2">
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
          
          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <div className="font-medium text-slate-600">No reviews yet</div>
              <div className="text-xs text-slate-400 mt-1">Be the first patient to share your experience with {center.centerName}.</div>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-slate-100">
              {reviews.map((rev, index) => (
                <div key={rev._id || index} className="pt-4 first:pt-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="font-bold text-slate-900 text-sm">{rev.user?.name || "Patient"}</div>
                    <RatingStars rating={rev.rating} size="w-3.5 h-3.5" />
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                  {rev.createdAt && (
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showBookingModal && selectedService && (
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

