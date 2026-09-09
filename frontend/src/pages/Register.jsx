import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "user"
      };

      await api.post("/auth/register", payload);
      alert("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-primary-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-primary-100">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">Create an account</h2>
        <p className="text-center text-slate-500 mb-8">
          Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
        </p>

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
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              name="phone"
              onChange={handleChange}
              type="tel"
              required
              placeholder="Enter your phone number"
              value={formData.phone}
              className="input-field bg-slate-50"
            />
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
