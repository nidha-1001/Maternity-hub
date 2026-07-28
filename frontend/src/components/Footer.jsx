import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Phone, Mail, MapPin, Shield, Award, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-rose-200/60 dark:border-slate-800 bg-rose-50/50 dark:bg-slate-900/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-teal-600 bg-clip-text text-transparent">
                MaternityHub
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Connecting expectant parents with top certified maternity centers, expert birthing specialists, prenatal care, and postnatal wellness services nationwide.
            </p>
            <div className="flex gap-3 text-rose-500 font-semibold text-xs">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-emerald-500" /> Verified Centers</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-500" /> Top Rated</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-rose-500 transition-colors">Home Page</Link></li>
              <li><Link to="/centers" className="hover:text-rose-500 transition-colors">Browse Maternity Centers</Link></li>
              <li><Link to="/my-bookings" className="hover:text-rose-500 transition-colors">My Appointments</Link></li>
              <li><Link to="/register" className="hover:text-rose-500 transition-colors">Register Your Maternity Center</Link></li>
            </ul>
          </div>

          {/* Care Services */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Maternity Services</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Prenatal Checkups & Sonography</li>
              <li>Water Birth & Natural Delivery Suites</li>
              <li>Postnatal Nursing & Lactation Care</li>
              <li>NICU & Newborn Intensive Care</li>
              <li>Maternal Nutrition Counseling</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Support & Contact</h4>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-500" />
                <span>+1 (800) 555-CARE (2273)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-500" />
                <span>support@maternityhub.care</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span>Healthcare Plaza, Suite 400</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} MaternityHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for mothers and families worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
