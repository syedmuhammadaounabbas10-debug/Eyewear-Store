import React, { useState } from 'react';
import { EyewearProduct, LensOption, LensCoating, PrescriptionData } from '../types/eyewear';
import { LENS_OPTIONS, LENS_COATINGS } from '../data/products';
import { X, Check, ShieldCheck, Truck, Sparkles, FileText, ShoppingBag, Eye, RotateCw } from 'lucide-react';

interface ProductDetailModalProps {
  product: EyewearProduct | null;
  onClose: () => void;
  onAddToCart: (
    product: EyewearProduct,
    colorIndex: number,
    lensOption: LensOption,
    lensCoating: LensCoating,
    prescription?: PrescriptionData
  ) => void;
  onOpenVirtualTryOn: (product: EyewearProduct) => void;
  onOpenPrescriptionHub: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenVirtualTryOn,
  onOpenPrescriptionHub,
}) => {
  if (!product) return null;

  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedLensOption, setSelectedLensOption] = useState<LensOption>(LENS_OPTIONS[0]);
  const [selectedLensCoating, setSelectedLensCoating] = useState<LensCoating>(LENS_COATINGS[0]);
  const [activeImageKey, setActiveImageKey] = useState<'front' | 'angle' | 'side' | 'onModel'>('front');
  const [prescriptionAttached, setPrescriptionAttached] = useState<boolean>(false);

  const selectedColor = product.colors[selectedColorIdx] || product.colors[0];

  const totalPKR = product.pricePKR + selectedLensOption.pricePKR + selectedLensCoating.pricePKR;

  const handleAdd = () => {
    onAddToCart(
      product,
      selectedColorIdx,
      selectedLensOption,
      selectedLensCoating,
      prescriptionAttached
        ? {
            method: 'upload',
            fileName: 'Prescription_Attached.pdf',
          }
        : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 aspect-[4/3] relative flex items-center justify-center overflow-hidden">
              <img
                src={product.images[activeImageKey]}
                alt={product.name}
                className="max-h-[320px] w-auto object-contain transition-all duration-300"
              />

              <button
                onClick={() => onOpenVirtualTryOn(product)}
                className="absolute bottom-3 left-3 bg-[#0f172a] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Eye className="w-3.5 h-3.5 text-[#c9a24b]" />
                <span>Virtual Fitting</span>
              </button>
            </div>

            {/* Thumbnail Selector */}
            <div className="grid grid-cols-4 gap-2">
              {(['front', 'angle', 'side', 'onModel'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveImageKey(key)}
                  className={`border rounded-lg p-1 aspect-[4/3] bg-slate-50 overflow-hidden transition-all ${
                    activeImageKey === key
                      ? 'border-[#0f172a] ring-2 ring-[#0f172a]/20 scale-105'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={product.images[key]}
                    alt={key}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>

            {/* Frame Dimensions & Material Callout */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center font-bold text-[#0f172a]">
                <span>Frame Measurements</span>
                <span>{product.dimensions}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Lens Width</span>
                  <span className="font-semibold text-slate-800">{product.lensWidthMm} mm</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Bridge Width</span>
                  <span className="font-semibold text-slate-800">{product.bridgeWidthMm} mm</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Temple Length</span>
                  <span className="font-semibold text-slate-800">{product.templeLengthMm} mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: PDP Configurator */}
          <div className="md:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#c9a24b]/20 text-[#0f172a] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {product.frameMaterial}
                </span>
                <span className="text-xs text-slate-500 font-semibold">• {product.frameShape}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{product.subtitle}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>

            {/* Color Swatches */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Select Frame Finish: <span className="text-[#0f172a] font-semibold">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      selectedColorIdx === idx
                        ? 'border-[#0f172a] bg-[#0f172a] text-white shadow'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Lens Option */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                1. Select Prescription Lens Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {LENS_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedLensOption(opt)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start justify-between gap-3 ${
                      selectedLensOption.id === opt.id
                        ? 'border-[#0f172a] bg-slate-900 text-white shadow'
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{opt.name}</p>
                      <p className={`text-[11px] mt-0.5 ${selectedLensOption.id === opt.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {opt.description}
                      </p>
                    </div>
                    <span className={`font-bold shrink-0 ${selectedLensOption.id === opt.id ? 'text-[#c9a24b]' : 'text-[#0f172a]'}`}>
                      {opt.pricePKR === 0 ? 'Included' : `+PKR ${opt.pricePKR.toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Lens Coating */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                2. Select Lens Protection & Coating
              </label>
              <div className="grid grid-cols-1 gap-2">
                {LENS_COATINGS.map((coat) => (
                  <button
                    key={coat.id}
                    onClick={() => setSelectedLensCoating(coat)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start justify-between gap-3 ${
                      selectedLensCoating.id === coat.id
                        ? 'border-[#0f172a] bg-slate-900 text-white shadow'
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{coat.name}</p>
                      <p className={`text-[11px] mt-0.5 ${selectedLensCoating.id === coat.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {coat.description}
                      </p>
                    </div>
                    <span className={`font-bold shrink-0 ${selectedLensCoating.id === coat.id ? 'text-[#c9a24b]' : 'text-[#0f172a]'}`}>
                      {coat.pricePKR === 0 ? 'Included' : `+PKR ${coat.pricePKR.toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Prescription Upload Attachment */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Prescription Attachment
                </label>
                <button
                  onClick={onOpenPrescriptionHub}
                  className="text-xs text-[#0f172a] font-semibold underline hover:text-[#c9a24b]"
                >
                  Need Help? Open Hub
                </button>
              </div>

              <div
                onClick={() => setPrescriptionAttached(!prescriptionAttached)}
                className={`p-3 rounded-xl border border-dashed cursor-pointer transition-all flex items-center justify-between ${
                  prescriptionAttached
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${prescriptionAttached ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-xs font-bold">
                      {prescriptionAttached ? 'Prescription Attached' : 'Attach Prescription Photo / PDF'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {prescriptionAttached
                        ? 'Your doctor prescription will be verified before production.'
                        : 'Click to mark prescription attachment or send later on WhatsApp.'}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    prescriptionAttached ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'
                  }`}
                >
                  {prescriptionAttached && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>

            {/* Price Total & Add To Bag */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TOTAL (INCL. TAX & LENSES)
                </span>
                <p className="text-2xl font-extrabold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                  PKR {totalPKR.toLocaleString()}
                </p>
              </div>

              <button
                onClick={handleAdd}
                className="px-6 py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#c9a24b]" />
                <span>Add Frame To Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
