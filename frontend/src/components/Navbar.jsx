import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut, Sun, Moon, ShieldCheck, Calendar, Building2, Menu, X, CheckSquare } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 transition-transform group-hover:scale-105">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            MaternityHub
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/centers"
            className={`text-sm font-medium transition-colors ${
              isActive("/centers") ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Centers
          </Link>

          {user && (
            <Link
              to="/my-bookings"
              className={`text-sm font-medium transition-colors ${
                isActive("/my-bookings") ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Bookings
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                isActive("/admin") ? "text-sky-600 dark:text-sky-400" : "text-sky-600/70 hover:text-sky-600 dark:hover:text-sky-300"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
              <Link to="/profile" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary text-sm px-4 py-1.5">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-500">
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-800 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-4 shadow-lg absolute w-full">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 dark:text-slate-300">Home</Link>
          <Link to="/centers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 dark:text-slate-300">Centers</Link>
          {user && (
            <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bookings</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-sky-600">Admin</Link>
          )}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-sm font-medium text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline justify-center w-full">Sign in</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary justify-center w-full">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
