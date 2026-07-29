import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-slate-800">MaternityHub</span>
            </div>
            <p className="text-slate-500 text-sm">
              Connecting expectant parents with top certified maternity centers and specialists nationwide.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-primary-500">Home</Link></li>
              <li><Link to="/centers" className="hover:text-primary-500">Browse Centers</Link></li>
              <li><Link to="/register" className="hover:text-primary-500">Register Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Prenatal Checkups</li>
              <li>Natural Delivery Suites</li>
              <li>Postnatal Nursing</li>
              <li>NICU Care</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>support@maternityhub.care</li>
              <li>+1 (800) 555-2273</li>
              <li>Healthcare Plaza, Suite 400</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MaternityHub Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
