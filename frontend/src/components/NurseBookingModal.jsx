import { useState, useContext } from "react";
import { X, Home, Heart, ChevronRight, ChevronLeft, Loader2, CheckCircle2, Star, ShieldCheck, AlertCircle, Phone } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const SHIFT_RATES = {
  "Hourly Visit (2-4 hrs)": { multiplier: 3, unit: "hour", label: "3 hrs" },
  "Day Shift (8 hrs)": { multiplier: 1, unit: "day", label: "1 day" },
  "Night Shift (10 PM - 6 AM)": { multiplier: 1, unit: "day", label: "1 night" },
  "24-hr Live-in": { multiplier: 1, unit: "day", label: "per day" },
};

const DELIVERY_TYPES = ["Normal Delivery", "C-Section", "Not Applicable"];

const NurseBookingModal = ({ nurse, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [success, setSuccess] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [form, setForm] = useState({
    shiftType: nurse.shiftTypes?.[0] || "Hourly Visit (2-4 hrs)",
    startDate: tomorrowStr,
    endDate: tomorrowStr,
    street: "",
    city: "",
    landmark: "",
    pincode: "",
    patientPhone: user?.phone ? String(user.phone).replace(/\D/g, "").slice(-10) : "",
    deliveryType: "Not Applicable",
    babyAgeDays: "",
    specialRequirements: "",
  });

  const calcDays = () => {
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diff);
  };

  const calcTotal = () => {
    const days = calcDays();
    const shift = SHIFT_RATES[form.shiftType];
    if (!shift) return 0;
    if (form.shiftType === "Hourly Visit (2-4 hrs)") {
      return nurse.hourlyRate * 3 * days;
    }
    return (nurse.dailyRate || nurse.hourlyRate * 8) * days;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "patientPhone") {
      const clean = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, patientPhone: clean }));
      if (!clean) {
        setPhoneError("Contact phone number is required");
      } else if (clean.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
      setError("");
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!form.shiftType) return "Please select a shift type";
    if (!form.startDate) return "Please select a start date";
    if (!form.endDate) return "Please select an end date";
    if (new Date(form.startDate) < new Date(new Date().toDateString())) return "Start date must be today or in the future";
    if (new Date(form.endDate) < new Date(form.startDate)) return "End date must be on or after start date";
    return null;
  };

  const validateStep2 = () => {
    if (!form.street.trim()) return "Street address is required";
    if (!form.city.trim()) return "City is required";
    const phone = String(form.patientPhone).replace(/\D/g, "");
    if (!phone) {
      setPhoneError("Contact phone number is required");
      return "Contact phone number is required";
    }
    if (phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return "Please enter a valid 10-digit contact phone number";
    }
    setPhoneError("");
    return null;
  };

  const goNext = () => {
    setError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setError("");

    const phone = String(form.patientPhone).replace(/\D/g, "").slice(-10);
    if (!phone || phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      setError("A valid 10-digit contact phone number is required");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/nurses/bookings/create", {
        nurseId: nurse._id,
        shiftType: form.shiftType,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        homeAddress: {
          street: form.street.trim(),
          city: form.city.trim(),
          landmark: form.landmark.trim(),
          pincode: form.pincode.trim(),
        },
        patientPhone: phone,
        deliveryType: form.deliveryType,
        babyAgeDays: form.babyAgeDays ? Number(form.babyAgeDays) : null,
        specialRequirements: form.specialRequirements.trim(),
        totalAmount: calcTotal(),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book nurse. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const days = calcDays();
  const total = calcTotal();

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Booking Confirmed! 🎉</h2>
          <p className="text-slate-500 text-sm mb-2">
            Your home nurse visit with <strong className="text-slate-800">{nurse.name}</strong> has been submitted.
          </p>
          <p className="text-slate-500 text-sm mb-6">
            You'll receive confirmation once the nurse accepts your request. Check your appointments to track status.
          </p>
          <div className="bg-primary-50 rounded-2xl p-4 mb-6 text-left border border-primary-100">
            <div className="text-xs text-slate-500 mb-1">Total Amount</div>
            <div className="text-2xl font-extrabold text-primary-600">₹{total.toLocaleString("en-IN")}</div>
            <div className="text-xs text-slate-400 mt-0.5">{days} day{days !== 1 ? "s" : ""} · {form.shiftType}</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onSuccess}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Browse More Nurses
            </button>
            <button
              onClick={() => { onSuccess(); navigate("/my-appointments"); }}
              className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              My Appointments →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {nurse.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-bold">{nurse.name}</h2>
                <ShieldCheck className="w-4 h-4 text-yellow-300" />
              </div>
              <p className="text-sm text-white/80">{nurse.qualification}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span className="text-sm font-bold">{nurse.rating?.toFixed(1)}</span>
                <span className="text-white/60 text-xs">· {nurse.experienceYears} yrs exp</span>
              </div>
            </div>
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-1 mt-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-yellow-300" : "bg-white/30"}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[11px] text-white/70">
            <span className={step >= 1 ? "text-yellow-300 font-semibold" : ""}>Schedule</span>
            <span className={step >= 2 ? "text-yellow-300 font-semibold" : ""}>Address</span>
            <span className={step >= 3 ? "text-yellow-300 font-semibold" : ""}>Confirm</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Shift & Dates */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Shift Type *</label>
                <div className="space-y-2">
                  {nurse.shiftTypes?.map((shift) => (
                    <label
                      key={shift}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        form.shiftType === shift
                          ? "border-primary-500 bg-primary-50"
                          : "border-slate-200 hover:border-primary-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shiftType"
                        value={shift}
                        checked={form.shiftType === shift}
                        onChange={handleChange}
                        className="accent-pink-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800">{shift}</div>
                        <div className="text-xs text-slate-400">
                          {shift === "Hourly Visit (2-4 hrs)" && `₹${(nurse.hourlyRate * 3).toLocaleString("en-IN")} per visit`}
                          {shift === "Day Shift (8 hrs)" && `₹${(nurse.dailyRate || nurse.hourlyRate * 8).toLocaleString("en-IN")} per day`}
                          {shift === "Night Shift (10 PM - 6 AM)" && `₹${(nurse.dailyRate || nurse.hourlyRate * 8).toLocaleString("en-IN")} per night`}
                          {shift === "24-hr Live-in" && `₹${(nurse.dailyRate || nurse.hourlyRate * 24).toLocaleString("en-IN")} per day`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
              {days > 0 && (
                <div className="text-center text-sm text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="font-bold text-primary-600">{days} day{days !== 1 ? "s" : ""}</span> service scheduled
                  <span className="font-bold text-slate-800 ml-2">· Est. Total: ₹{calcTotal().toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Home Address */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-4 h-4 text-primary-500" />
                <h3 className="font-semibold text-slate-800">Home Address for Visit</h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="e.g. 42 Rose Garden Layout, Near Lakeview Park"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Kochi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 682001"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="e.g. Opposite Apollo Hospital"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number (10 Digits) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-xs font-bold text-slate-500 pointer-events-none select-none">
                    <Phone className="w-3.5 h-3.5 mr-1 text-primary-500" /> +91
                  </div>
                  <input
                    type="tel"
                    name="patientPhone"
                    value={form.patientPhone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full pl-16 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      phoneError
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                        : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500"
                    }`}
                  />
                </div>
                {phoneError ? (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{phoneError}</p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">Nurse will call this 10-digit number before arriving for the visit.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Patient Info & Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Type</label>
                  <select
                    name="deliveryType"
                    value={form.deliveryType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {DELIVERY_TYPES.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Baby's Age (Days)</label>
                  <input
                    type="number"
                    name="babyAgeDays"
                    value={form.babyAgeDays}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    min="0"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Requirements / Notes</label>
                <textarea
                  rows={3}
                  name="specialRequirements"
                  value={form.specialRequirements}
                  onChange={handleChange}
                  placeholder="e.g. C-section wound care needed, twins, premature baby, allergies, access instructions..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-4 border border-primary-100 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm mb-3">Booking Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Nurse</span>
                  <span className="font-semibold text-slate-800">{nurse.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shift</span>
                  <span className="font-semibold text-slate-800">{form.shiftType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {form.startDate !== form.endDate && ` – ${new Date(form.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                    {" "}({days} day{days !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Address</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[180px]">{form.street}, {form.city}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Contact Phone</span>
                  <span className="font-semibold text-slate-800">+91 {form.patientPhone}</span>
                </div>
                <div className="border-t border-primary-200 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-slate-800">Total Payable</span>
                  <span className="font-extrabold text-lg text-primary-600">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={goNext}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !user}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-70 shadow-sm"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
              {submitting ? "Booking..." : !user ? "Login to Book" : `Confirm Booking · ₹${total.toLocaleString("en-IN")}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseBookingModal;
