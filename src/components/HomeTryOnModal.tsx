import React, { useState } from 'react';
import { PRODUCTS, PAKISTAN_CITIES } from '../data/products';
import { EyewearProduct } from '../types/eyewear';
import { X, Check, Home, MapPin, Truck, CheckCircle2, Shield } from 'lucide-react';

interface HomeTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HomeTryOnModal: React.FC<HomeTryOnModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [selectedFrameIds, setSelectedFrameIds] = useState<string[]>([PRODUCTS[0].id, PRODUCTS[1].id]);
  const [cityName, setCityName] = useState<string>('Lahore');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const toggleFrameSelection = (id: string) => {
    if (selectedFrameIds.includes(id)) {
      setSelectedFrameIds(selectedFrameIds.filter((fId) => fId !== id));
    } else {
      if (selectedFrameIds.length >= 3) {
        alert('You can select a maximum of 3 frames for the Home Try-On box.');
        return;
      }
      setSelectedFrameIds([...selectedFrameIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFrameIds.length === 0) {
      alert('Please select at least 1 frame to try at home.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c9a24b]/20 text-[#0f172a] rounded-full text-xs font-bold uppercase mb-2">
                <Home className="w-3.5 h-3.5 text-[#c9a24b]" />
                <span>3-Day Home Trial Service</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                Book 3 Frames Delivered To Your Doorstep
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select up to 3 optical frames. Our courier partner delivers the trial box to your home across Pakistan. Try them for 3 days and return the ones you don't keep!
              </p>
            </div>

            {/* Frame Selector Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                <span>Select Up to 3 Frames:</span>
                <span className="text-[#c9a24b] font-extrabold">{selectedFrameIds.length} / 3 Selected</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {PRODUCTS.map((p) => {
                  const isSelected = selectedFrameIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleFrameSelection(p.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0f172a] bg-slate-900 text-white shadow'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <img src={p.images.front} alt={p.name} className="w-full h-16 object-contain bg-white rounded p-1" />
                      <div className="mt-2">
                        <p className="text-xs font-bold line-clamp-1">{p.name}</p>
                        <p className={`text-[10px] ${isSelected ? 'text-[#c9a24b]' : 'text-slate-500'}`}>
                          PKR {p.pricePKR.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zaid Khan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City in Pakistan</label>
                <select
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0f172a]"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="House #, Street, Block, Phase"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              Confirm 3-Frame Home Try-On Box Request
            </button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#0f172a]">Home Try-On Request Received!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your 3-frame home trial box has been dispatched to <strong>{address}, {cityName}</strong>. Our courier representative will contact you at <strong>{phone}</strong> prior to delivery.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-left max-w-md mx-auto border border-slate-200 space-y-1">
              <p className="font-bold text-[#0f172a]">Request Summary:</p>
              <p className="text-slate-500">• Trial Period: 3 Days from delivery</p>
              <p className="text-slate-500">• Selected Frames: {selectedFrameIds.length} Frames</p>
              <p className="text-slate-500">• Zero Security Deposit Charged</p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0f172a] text-white text-xs font-bold rounded-xl"
            >
              Return to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
