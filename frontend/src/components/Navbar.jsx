import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { HeartHandshake, User, LogOut, Sun, Moon, ShieldCheck, Calendar, Building2, Menu, X } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-nav transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform duration-300">
            <HeartHandshake className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
              Maternity<span className="text-teal-600 dark:text-teal-400">Hub</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Care & Birth Centers
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-rose-100/40 dark:bg-slate-800/80 p-1.5 rounded-full border border-rose-200/60 dark:border-slate-700/50">
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              isActive("/") ? "bg-rose-500 text-white shadow-md" : "text-slate-700 dark:text-slate-300 hover:text-rose-600"
            }`}
          >
            Home
          </Link>
          <Link
            to="/centers"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive("/centers") ? "bg-rose-500 text-white shadow-md" : "text-slate-700 dark:text-slate-300 hover:text-rose-600"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Maternity Centers
          </Link>

          {user && (
            <Link
              to="/my-bookings"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive("/my-bookings") ? "bg-rose-500 text-white shadow-md" : "text-slate-700 dark:text-slate-300 hover:text-rose-600"
              }`}
            >
              <Calendar className="w-4 h-4" />
              My Bookings
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive("/admin") ? "bg-purple-600 text-white shadow-md" : "text-purple-600 dark:text-purple-400 hover:text-purple-700"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm border border-rose-200 dark:border-rose-800 group-hover:scale-105 transition-transform">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {user.name}
                  </span>
                  <span className="block text-[11px] text-rose-500 font-medium capitalize">
                    {user.role}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register Center / User
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card m-4 p-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/centers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Maternity Centers
          </Link>
          {user && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              My Bookings
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg font-medium text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            >
              Admin Portal
            </Link>
          )}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> My Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg font-medium text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline w-full"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
