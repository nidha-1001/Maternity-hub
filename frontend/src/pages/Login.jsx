import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Since backend might not have any users yet, we will just simulate a login or call the API
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      alert(result.message);
    }
  };

  return (
     <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-primary-50 flex items-center justify-center">
       <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-primary-100">
         <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">Sign in to your account</h2>
         <p className="text-center text-slate-500 mb-8">
           Or <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">create a new account</Link>
         </p>
         
         <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
             <input 
               type="email" 
               required 
               value={email} 
               onChange={e => setEmail(e.target.value)} 
               placeholder="Enter your email address"
               className="input-field bg-slate-50" 
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
             <input 
               type="password" 
               required 
               value={password} 
               onChange={e => setPassword(e.target.value)} 
               placeholder="Enter your password"
               className="input-field bg-slate-50" 
             />
           </div>
           <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-lg mt-2">
             {loading ? "Signing in..." : "Sign in"}
           </button>
         </form>
       </div>
     </div>
  );
};

export default Login;
