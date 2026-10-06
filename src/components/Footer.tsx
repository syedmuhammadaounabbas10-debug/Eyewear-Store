import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-12 border-t border-slate-800 text-left">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Info Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold tracking-[-0.03em] text-3xl text-white font-['Plus_Jakarta_Sans']">
                NAZAR
              </span>
              <span className="text-xs font-bold text-[#c9a24b] tracking-wider uppercase">
                .PK
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Architectural luxury eyewear designed for discerning Pakistani tastemakers. Handcrafted Italian organic acetate and grade-5 Japanese titanium.
            </p>
            <div className="text-xs text-slate-400 space-y-1.5 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c9a24b]" />
                <span>Headquarters: Gulberg III, MM Alam Road, Lahore</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c9a24b]" />
                <span>WhatsApp Support: 03245908220</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c9a24b]" />
                <span>Concierge: care@nazar.pk</span>
              </p>
            </div>
          </div>

          {/* Atelier Stores Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#c9a24b]">
              Atelier Showrooms
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <p className="font-bold text-white">Lahore Atelier</p>
                <p className="text-slate-400">Block C-2, MM Alam Road, Gulberg III</p>
              </div>
              <div>
                <p className="font-bold text-white">Karachi Flagship</p>
                <p className="text-slate-400">Main Khayaban-e-Shahbaz, DHA Phase 6</p>
              </div>
              <div>
                <p className="font-bold text-white">Islamabad Studio</p>
                <p className="text-slate-400">F-7 Markaz, Next to Safa Gold</p>
              </div>
            </div>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#c9a24b]">
              Customer Care & Trial
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• 3-Day Home Try-On Service</li>
              <li>• Prescription Lens Guide & PD Meter</li>
              <li>• Free TCS Courier Shipping Across Pakistan</li>
              <li>• Doctor Verified Optometrist Audit</li>
              <li>• 7-Day Hassle-Free Frame Exchange</li>
              <li>• AI Custom Frame Creation Studio</li>
            </ul>
          </div>

          {/* Payment Methods Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-[#c9a24b]">
              Accepted Payments
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <span className="block px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 font-semibold">
                Cash on Delivery (COD)
              </span>
              <span className="block px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 font-semibold">
                Easypaisa
              </span>
              <span className="block px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 font-semibold">
                Meezan Bank Transfer
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Nazar.pk Optics Atelier. All rights reserved across Pakistan.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#prescriptions" className="hover:text-slate-300 transition-colors">Optometry Guarantee</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
