import { Link } from "react-router-dom";
import { HeartPulse, Menu, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed w-full z-50 glass-card bg-white/80 border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              MaternityHub
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-primary-500 font-medium transition-colors">Home</Link>
            <Link to="/centers" className="text-slate-600 hover:text-primary-500 font-medium transition-colors">Centers</Link>
            
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-2 text-slate-700 hover:text-primary-500">
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                  </Link>
                  <button onClick={logout} className="btn-secondary text-sm">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-slate-600 font-medium hover:text-primary-500">Sign in</Link>
                  <Link to="/register" className="btn-primary">Register</Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="text-slate-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
