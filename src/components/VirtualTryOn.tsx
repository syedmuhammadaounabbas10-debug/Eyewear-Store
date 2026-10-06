import React, { useState, useRef } from 'react';
import { EyewearProduct } from '../types/eyewear';
import { PRODUCTS } from '../data/products';
import { Camera, Upload, Sliders, Check, Eye, RefreshCw, Layers, ArrowLeftRight } from 'lucide-react';

interface VirtualTryOnProps {
  initialProduct?: EyewearProduct | null;
  customImageUrl?: string | null;
  onSelectProduct: (product: EyewearProduct) => void;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  initialProduct,
  customImageUrl,
  onSelectProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<EyewearProduct>(initialProduct || PRODUCTS[0]);
  const [compareProduct, setCompareProduct] = useState<EyewearProduct | null>(null);

  // Avatar models
  const SAMPLE_MODELS = [
    { id: 'm1', name: 'Female Portrait (Oval)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
    { id: 'm2', name: 'Male Portrait (Square)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
    { id: 'm3', name: 'Female Portrait (Round)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800' },
  ];

  const [activeModelUrl, setActiveModelUrl] = useState<string>(SAMPLE_MODELS[0].url);
  const [userUploadedPhoto, setUserUploadedPhoto] = useState<string | null>(null);

  // Fitting Adjustments
  const [scale, setScale] = useState<number>(100);
  const [posY, setPosY] = useState<number>(38);
  const [posX, setPosX] = useState<number>(50);
  const [rotation, setRotation] = useState<number>(0);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUserUploadedPhoto(url);
      setActiveModelUrl(url);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-8 max-w-[1360px] mx-auto text-left">
      <div className="bg-[#0f172a] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#c9a24b] uppercase tracking-wider">
              INTERACTIVE OPTICAL FITTING
            </span>
            <h2 className="text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
              Virtual Try-On Fitting Mirror
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Preview how Nazar frames fit on sample faces or upload your own photo to align temple width, pupil height, and bridge balance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-4 py-2.5 bg-white text-[#0f172a] hover:bg-slate-100 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#c9a24b]" />
              <span>Upload Your Photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Fitting Mirror */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#0f172a] text-base font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#c9a24b]" />
              <span>
                {compareProduct ? 'Side-by-Side Frame Comparison' : `Fitting Mirror: ${selectedProduct.name}`}
              </span>
            </h3>

            {compareProduct ? (
              <button
                onClick={() => setCompareProduct(null)}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Close Comparison
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-semibold">
                Adjust scale & position sliders below
              </span>
            )}
          </div>

          {/* Mirror Canvas Container */}
          <div className={`grid ${compareProduct ? 'grid-cols-2 gap-4' : 'grid-cols-1'} items-center`}>
            {/* Mirror 1 */}
            <div className="relative aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
              <img
                src={activeModelUrl}
                alt="Model face"
                className="w-full h-full object-cover"
              />

              {/* Eyewear Frame Overlay */}
              <div
                className="absolute pointer-events-none transition-all duration-75"
                style={{
                  top: `${posY}%`,
                  left: `${posX}%`,
                  width: `${scale * 0.55}%`,
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
              >
                <img
                  src={customImageUrl || selectedProduct.images.front}
                  alt={selectedProduct.name}
                  className="w-full h-auto object-contain filter drop-shadow-md"
                />
              </div>

              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20">
                {selectedProduct.name} ({selectedProduct.dimensions})
              </div>
            </div>

            {/* Mirror 2 (Comparison Mode) */}
            {compareProduct && (
              <div className="relative aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                <img
                  src={activeModelUrl}
                  alt="Model face"
                  className="w-full h-full object-cover"
                />

                <div
                  className="absolute pointer-events-none transition-all duration-75"
                  style={{
                    top: `${posY}%`,
                    left: `${posX}%`,
                    width: `${scale * 0.55}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  }}
                >
                  <img
                    src={compareProduct.images.front}
                    alt={compareProduct.name}
                    className="w-full h-auto object-contain filter drop-shadow-md"
                  />
                </div>

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-amber-300 border border-amber-300/30">
                  Comparing: {compareProduct.name} ({compareProduct.dimensions})
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#c9a24b]" />
              <span>Precision Fitting Controls</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Frame Size: {scale}%
                </label>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-[#0f172a]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Pupil Bridge Height (Y): {posY}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="70"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full accent-[#0f172a]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Horizontal Offset (X): {posX}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full accent-[#0f172a]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Frame Selector Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sample Model Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Sample Face Shapes:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModelUrl(m.url)}
                  className={`border rounded-lg p-1 text-center transition-all ${
                    activeModelUrl === m.url
                      ? 'border-[#0f172a] ring-2 ring-[#0f172a]/20 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={m.url} alt={m.name} className="w-full h-16 object-cover rounded" />
                  <span className="text-[10px] font-semibold text-slate-600 line-clamp-1 mt-1 block">
                    {m.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Selector List */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Frame To Try:
              </label>
              <span className="text-[10px] text-slate-500 font-bold">{PRODUCTS.length} Models</span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedProduct.id === p.id
                      ? 'border-[#0f172a] bg-slate-900 text-white shadow'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images.front}
                      alt={p.name}
                      className="w-12 h-10 object-contain bg-white rounded p-1"
                    />
                    <div>
                      <p className="text-xs font-bold">{p.name}</p>
                      <p className={`text-[10px] ${selectedProduct.id === p.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {p.frameMaterial} • {p.dimensions}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold ${selectedProduct.id === p.id ? 'text-[#c9a24b]' : 'text-[#0f172a]'}`}>
                      PKR {p.pricePKR.toLocaleString()}
                    </span>

                    {selectedProduct.id !== p.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCompareProduct(p);
                        }}
                        className="block text-[10px] text-slate-500 font-semibold underline mt-1 hover:text-black"
                      >
                        Compare Side-by-Side
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
