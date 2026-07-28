import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerCenterApi } from "../services/api";
import { CheckSquare } from "lucide-react";

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
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-10 h-10 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 mb-4">
          <CheckSquare className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="ui-card py-8 px-4 sm:px-10">
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-8">
            <button
              onClick={() => setAccountType("user")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                accountType === "user" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setAccountType("center")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                accountType === "center" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Center Provider
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-3 rounded-md text-sm font-medium">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {accountType === "center" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Center Name</label>
                  <input type="text" required value={centerName} onChange={(e) => setCenterName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                    <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {accountType === "center" ? "Owner Name" : "Full Name"}
                </label>
                <input type="text" required value={accountType === "center" ? ownerName : name} onChange={(e) => accountType === "center" ? setOwnerName(e.target.value) : setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {accountType === "center" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn btn-primary w-full py-2.5 mt-4">
              {submitting ? "Processing..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
