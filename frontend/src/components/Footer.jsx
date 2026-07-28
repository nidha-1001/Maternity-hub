import React from "react";
import { Link } from "react-router-dom";
import { CheckSquare } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
                <CheckSquare className="w-3 h-3" />
              </div>
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                MaternityHub
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Connecting expectant parents with top certified maternity centers and specialists nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/centers" className="hover:text-slate-900 dark:hover:text-white transition-colors">Browse Centers</Link></li>
              <li><Link to="/register" className="hover:text-slate-900 dark:hover:text-white transition-colors">Register Center</Link></li>
            </ul>
          </div>

          {/* Care Services */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Services</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>Prenatal Checkups</li>
              <li>Natural Delivery Suites</li>
              <li>Postnatal Nursing</li>
              <li>NICU Care</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>support@maternityhub.care</li>
              <li>+1 (800) 555-2273</li>
              <li>Healthcare Plaza, Suite 400</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MaternityHub Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
