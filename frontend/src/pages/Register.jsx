import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerCenterApi } from "../services/api";
import { HeartHandshake, User, Mail, Lock, Phone, MapPin, Building2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("user"); // "user" or "center"
  
  // User Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Center Fields
  const [centerName, setCenterName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      if (accountType === "user") {
        await register({ name, email, password, phone, role: "user" });
        navigate("/centers");
      } else {
        // Register Maternity Center
        await registerCenterApi({
          centerName,
          ownerName,
          email,
          password,
          phone,
          address,
          location,
          description,
        });

        // Also register center owner account so they can login
        await register({ name: ownerName, email, password, phone, role: "user" });

        setSuccess("Maternity Center application submitted! Pending admin review.");
        setTimeout(() => {
          navigate("/centers");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-xl p-8 sm:p-10 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-500/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select account type to get started with MaternityHub
          </p>
        </div>

        {/* ACCOUNT TYPE TOGGLE */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-rose-100/50 dark:bg-slate-800/80 rounded-2xl border border-rose-200/60 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setAccountType("user")}
            className={`py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              accountType === "user"
                ? "bg-rose-500 text-white shadow-md"
                : "text-slate-600 hover:text-rose-600 dark:hover:text-slate-200"
            }`}
          >
            <User className="w-4 h-4" /> Expectant Parent / User
          </button>
          <button
            type="button"
            onClick={() => setAccountType("center")}
            className={`py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              accountType === "center"
                ? "bg-rose-500 text-white shadow-md"
                : "text-slate-600 hover:text-rose-600 dark:hover:text-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" /> Maternity Center Owner
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {accountType === "center" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Maternity Center Name
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    placeholder="e.g. Hope Maternity & Infant Hospital"
                    className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    City / Location
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Full Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street & Suite Number"
                    className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {accountType === "center" ? "Owner / Director Name" : "Full Name"}
              </label>
              <div className="relative flex items-center">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={accountType === "center" ? ownerName : name}
                  onChange={(e) => accountType === "center" ? setOwnerName(e.target.value) : setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555-0199"
                  className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {accountType === "center" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Center Description / Amenities
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of facility features (NICU, Water Birth, Private Rooms...)"
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-rose-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? "Creating Account..." : accountType === "center" ? "Submit Center Application" : "Complete Registration"}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-rose-600 dark:text-rose-400 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
