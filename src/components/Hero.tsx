import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Eye } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenBespoke: () => void;
  onOpenHomeTryOn: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenBespoke,
  onOpenHomeTryOn,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] text-white py-16 sm:py-24 border-b border-slate-800">
      {/* Subtle Background Architectural Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c9a24b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a24b]/15 border border-[#c9a24b]/40 text-[#c9a24b] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Optics for Pakistan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.15] text-white font-['Plus_Jakarta_Sans']">
              Clinical Precision meets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#c9a24b] to-amber-400">
                Bespoke Atelier Craft.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
              Handcrafted Italian acetate and featherlight Japanese titanium optical frames.
              Customized with German HD prescription lenses and direct 3-day home try-on across Lahore, Karachi, and Islamabad.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="px-7 py-3.5 bg-[#c9a24b] hover:bg-amber-500 text-[#0f172a] font-bold rounded-md shadow-lg transition-all flex items-center gap-2 text-base active:scale-98"
              >
                <span>Explore Winter '26 Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBespoke}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-md border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 text-base"
              >
                <Sparkles className="w-4 h-4 text-[#c9a24b]" />
                <span>Design Custom Frame (AI)</span>
                <span className="text-[10px] bg-[#c9a24b] text-[#0f172a] font-bold px-1.5 py-0.5 rounded">
                  4K
                </span>
              </button>

              <button
                onClick={onOpenHomeTryOn}
                className="text-slate-300 hover:text-white text-sm font-semibold underline underline-offset-4 decoration-[#c9a24b] py-2 px-1"
              >
                Request 3-Frame Home Box
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <p className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">100%</p>
                <p className="text-xs text-slate-400">Pure Japanese Titanium</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#c9a24b] font-['Plus_Jakarta_Sans']">3 Days</p>
                <p className="text-xs text-slate-400">Home Try-On Box</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">420nm</p>
                <p className="text-xs text-slate-400">Blue Guard Shield</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">COD / Wallets</p>
                <p className="text-xs text-slate-400">JazzCash & EasyPaisa</p>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000"
                alt="The Margalla Titan Frame"
                className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/30 to-transparent" />

              {/* Product Floating Metadata Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#c9a24b] uppercase tracking-widest">
                      FEATURED ATELIER EDITION
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">The Margalla Titan</h3>
                    <p className="text-xs text-slate-300">Grade-5 Japanese Titanium • 53-18-145mm</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-semibold">PKR</p>
                    <p className="text-lg font-extrabold text-[#c9a24b]">18,500</p>
                  </div>
                </div>
              </div>

              {/* Floating Top Tag */}
              <div className="absolute top-4 right-4 bg-[#c9a24b] text-[#0f172a] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Handcrafted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Guarantee Pillars */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 mt-12 pt-8 border-t border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <Truck className="w-5 h-5 text-[#c9a24b] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Courier Delivery Across Pakistan</h4>
              <p className="text-xs text-slate-400">Fast 24-48 hr dispatch to Lahore, Karachi & Islamabad.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <RefreshCw className="w-5 h-5 text-[#c9a24b] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">3-Day Home Try-On</h4>
              <p className="text-xs text-slate-400">Select 3 frames to try in the comfort of your home.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-[#c9a24b] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Doctor Verified Lenses</h4>
              <p className="text-xs text-slate-400">Every prescription is audited by licensed optometrists.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <Eye className="w-5 h-5 text-[#c9a24b] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">AI Bespoke Frame Creation</h4>
              <p className="text-xs text-slate-400">Generate 1K, 2K & 4K custom frame concepts instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
