import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: ""
  });
  const [phoneError, setPhoneError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const clean = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: clean }));
      if (clean && clean.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: cleanPhone,
        role: "user"
      };

      await api.post("/auth/register", payload);
      alert("Account created successfully! Please sign in.");
      navigate("/login", { state: { from: location.state?.from } });
    } catch (error) {
      setFormError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-primary-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-primary-100">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">Create an account</h2>
        <p className="text-center text-slate-500 mb-8">
          Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
        </p>

        {formError && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              name="name"
              onChange={handleChange}
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.name}
              className="input-field bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (10 Digits)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</span>
              <input
                name="phone"
                onChange={handleChange}
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={formData.phone}
                className={`input-field pl-12 bg-slate-50 ${phoneError ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
            </div>
            {phoneError && (
              <p className="text-xs text-rose-500 mt-1">{phoneError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              name="email"
              onChange={handleChange}
              type="email"
              required
              placeholder="Enter your email address"
              value={formData.email}
              className="input-field bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              name="password"
              onChange={handleChange}
              type="password"
              required
              placeholder="Create a password"
              value={formData.password}
              className="input-field bg-slate-50"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-lg mt-4">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
