import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProfileApi } from "../services/api";
import { User, Mail, Phone, Lock, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: "", text: "" });

    try {
      await updateProfileApi({ name, email, phone, password });
      setMsg({ type: "success", text: "Profile details updated successfully!" });
      setPassword("");
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your contact information and security settings.
        </p>
      </div>

      <div className="glass-card p-8 sm:p-10 rounded-3xl space-y-6 shadow-xl border border-slate-200/80 dark:border-slate-800">
        
        {/* AVATAR BADGE */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Role: {user?.role}
            </span>
          </div>
        </div>

        {msg.text && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}
          >
            {msg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
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
                  className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
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
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              New Password (Optional)
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                value={password}
                placeholder="Leave blank to keep unchanged"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={logout}
              className="btn btn-outline text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
            >
              Sign Out
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary px-8 py-3 text-sm font-bold"
            >
              {submitting ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
