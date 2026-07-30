import { Link } from "react-router-dom";
import { HeartPulse, Menu, User } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-primary-500 transition-colors p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 shadow-lg absolute w-full left-0 top-full">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium">Home</Link>
              <Link to="/centers" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium">Centers</Link>
              <hr className="border-slate-100" />
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/profile'} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-medium flex items-center gap-2">
                    <User className="w-5 h-5" /> {user.name}
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="btn-secondary w-full text-center">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium">Sign in</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full text-center">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
