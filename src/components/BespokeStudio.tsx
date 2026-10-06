import React, { useState } from 'react';
import { Sparkles, Image, RefreshCw, ZoomIn, Download, CheckCircle2, AlertCircle, ShoppingBag, Sliders, Layers } from 'lucide-react';
import { EyewearProduct } from '../types/eyewear';

interface BespokeStudioProps {
  onAddCustomFrameToCart: (customProduct: EyewearProduct, resolution: '1K' | '2K' | '4K', imageUrl: string) => void;
  onOpenVirtualTryOnWithImage?: (imageUrl: string) => void;
}

export const BespokeStudio: React.FC<BespokeStudioProps> = ({
  onAddCustomFrameToCart,
  onOpenVirtualTryOnWithImage,
}) => {
  // Config state
  const [shape, setShape] = useState<string>('Architectural Square');
  const [material, setMaterial] = useState<string>('Handcrafted Italian Acetate');
  const [color, setColor] = useState<string>('Vintage Tortoiseshell');
  const [lens, setLens] = useState<string>('Anti-Reflective Clear');
  const [style, setStyle] = useState<string>('Mughal Lattice Filigree Temples');
  const [promptText, setPromptText] = useState<string>('');
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('4K');

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState<boolean>(false);

  // Inspiration Presets
  const PRESETS = [
    {
      title: 'Royal Lahore Gold',
      shape: 'Double-Bridge Aviator',
      material: '18K Gold Plated Accent',
      color: 'Champagne Gold',
      lens: '30% Smoked Amber',
      style: 'Mughal Lattice Filigree Temples',
      prompt: 'Inspired by classical Badshahi Lahore archways with intricate gold wire lattice.',
    },
    {
      title: 'Margalla Emerald',
      shape: 'Architectural Square',
      material: 'Handcrafted Italian Acetate',
      color: 'Deep Emerald Marble',
      lens: 'Anti-Reflective Clear',
      style: 'Beveled Edges & Flush Gold Pins',
      prompt: 'Deep forest green marble acetate with hand-beveled architectural rim.',
    },
    {
      title: 'Titanium Hex',
      shape: 'Geometric Hexagon',
      material: 'Grade-5 Japanese Titanium',
      color: 'Midnight Slate',
      lens: 'Gradient Rose',
      style: 'Minimalist Flush Pins',
      prompt: 'Ultra-thin matte titanium with geometric rim knurling.',
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shape,
          material,
          color,
          lens,
          style,
          prompt: promptText,
          resolution,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate frame image.');
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error generating frame. Please check server settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setShape(preset.shape);
    setMaterial(preset.material);
    setColor(preset.color);
    setLens(preset.lens);
    setStyle(preset.style);
    setPromptText(preset.prompt);
  };

  const handleOrderCustomBespoke = () => {
    if (!generatedImageUrl) return;

    const bespokeProduct: EyewearProduct = {
      id: `bespoke-${Date.now()}`,
      name: `Bespoke Custom (${shape})`,
      subtitle: `${material} • ${color}`,
      description: `1-of-1 Atelier Custom Frame concept generated in ${resolution} resolution. Style: ${style}. Details: ${promptText || 'Custom design'}.`,
      pricePKR: 28500,
      originalPricePKR: 32000,
      frameType: 'Bespoke Atelier',
      frameShape: shape as any,
      frameMaterial: material as any,
      colors: [{ name: color, hex: '#c9a24b' }],
      dimensions: '53 - 19 - 145 mm',
      lensWidthMm: 53,
      bridgeWidthMm: 19,
      templeLengthMm: 145,
      suitableFaceShapes: ['Oval', 'Square', 'Round'],
      images: {
        front: generatedImageUrl,
        angle: generatedImageUrl,
        side: generatedImageUrl,
        onModel: generatedImageUrl,
      },
      tags: ['Bespoke Atelier', '1-of-1 Custom', `${resolution} HD`],
      rating: 5.0,
      reviewCount: 1,
    };

    onAddCustomFrameToCart(bespokeProduct, resolution, generatedImageUrl);
  };

  return (
    <section className="py-12 px-4 sm:px-8 max-w-[1360px] mx-auto text-left">
      {/* Studio Header */}
      <div className="bg-[#0f172a] text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#c9a24b]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a24b]/20 border border-[#c9a24b]/40 text-[#c9a24b] text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Frame Generator (gemini-3-pro-image-preview)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
              Nazar Atelier Bespoke Frame Studio
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Specify your silhouette, Japanese metals, Italian acetates, and desired image resolution (1K, 2K, or 4K) to synthesize custom 1-of-1 luxury frame concepts.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="w-full text-xs text-slate-400 font-semibold uppercase tracking-wider block md:inline mb-1 md:mb-0">
              Inspiration Presets:
            </span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 font-['Plus_Jakarta_Sans']">
              <Sliders className="w-5 h-5 text-[#c9a24b]" />
              <span>Frame Specifications</span>
            </h3>
            <span className="text-xs text-slate-500">Customize parameters</span>
          </div>

          {/* REQUIRED AFFORDANCE: Image Size Selection (1K, 2K, 4K) */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#c9a24b]" />
                <span>Image Resolution (Affordance)</span>
              </label>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#0f172a] text-[#c9a24b]">
                {resolution} Output
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Select output resolution for detail synthesis in model <code className="text-[#0f172a] font-semibold">gemini-3-pro-image-preview</code>:
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['1K', '2K', '4K'] as const).map((resOption) => (
                <button
                  key={resOption}
                  type="button"
                  onClick={() => setResolution(resOption)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                    resolution === resOption
                      ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-md ring-2 ring-[#c9a24b]/40'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm font-extrabold">{resOption}</span>
                  <span className="text-[9px] opacity-80">
                    {resOption === '1K' ? '1024 px' : resOption === '2K' ? '2048 px' : '3840 px (Ultra)'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Silhouette Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Frame Silhouette
            </label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0f172a]"
            >
              <option value="Architectural Square">Architectural Square</option>
              <option value="Double-Bridge Aviator">Double-Bridge Aviator</option>
              <option value="Geometric Hexagon">Geometric Hexagon</option>
              <option value="Sculpted Cat-Eye">Sculpted Cat-Eye</option>
              <option value="Rounded Pantos Oval">Rounded Pantos Oval</option>
              <option value="Classic Clubmaster Browline">Classic Clubmaster Browline</option>
            </select>
          </div>

          {/* Material Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Frame Material
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0f172a]"
            >
              <option value="Handcrafted Italian Acetate">Handcrafted Italian Acetate</option>
              <option value="Grade-5 Japanese Titanium">Grade-5 Japanese Titanium</option>
              <option value="18K Gold Plated Accent">18K Gold Plated Accent</option>
              <option value="Translucent Amber Resin">Translucent Amber Resin</option>
              <option value="Matte Obsidian Metal">Matte Obsidian Metal</option>
            </select>
          </div>

          {/* Color & Pattern */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Color / Finish Pattern
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0f172a]"
            >
              <option value="Vintage Tortoiseshell">Vintage Tortoiseshell</option>
              <option value="Deep Emerald Marble">Deep Emerald Marble</option>
              <option value="Midnight Slate">Midnight Slate</option>
              <option value="Champagne Gold">Champagne Gold</option>
              <option value="Rose Crystal">Rose Crystal</option>
              <option value="Royal Sapphire Blue">Royal Sapphire Blue</option>
            </select>
          </div>

          {/* Lens Tint & Coating */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Lens Treatment
            </label>
            <select
              value={lens}
              onChange={(e) => setLens(e.target.value)}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0f172a]"
            >
              <option value="Anti-Reflective Clear">Anti-Reflective Clear</option>
              <option value="30% Smoked Amber">30% Smoked Amber</option>
              <option value="Solid Dark Grey Polarized">Solid Dark Grey Polarized</option>
              <option value="Emerald Green Mirror">Emerald Green Mirror</option>
              <option value="Gradient Rose Tint">Gradient Rose Tint</option>
            </select>
          </div>

          {/* Style Accent Details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Bespoke Temple & Pin Detail
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0f172a]"
            >
              <option value="Mughal Lattice Filigree Temples">Mughal Lattice Filigree Temples</option>
              <option value="Beveled Edges & Flush Gold Pins">Beveled Edges & Flush Gold Pins</option>
              <option value="Diamond Knurled Rim & Titanium Wire">Diamond Knurled Rim & Titanium Wire</option>
              <option value="Minimalist Flush Pins">Minimalist Flush Pins</option>
            </select>
          </div>

          {/* Custom Details Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Custom Prompt Details (Optional)
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Include subtle gold wire engraving inspired by Mughal archways, soft warm alabaster backdrop..."
              rows={3}
              className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a] resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-98 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#c9a24b]" />
                <span>Generating {resolution} Concept...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#c9a24b]" />
                <span>Synthesize {resolution} Frame Concept</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right Preview Canvas */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[520px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-extrabold text-[#c9a24b] uppercase tracking-widest">
                LIVE CANVAS
              </span>
              <h3 className="text-lg font-bold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                {generatedImageUrl ? 'Custom Frame Concept' : 'Preview Canvas'}
              </h3>
            </div>

            {generatedImageUrl && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-[#c9a24b] text-[#0f172a] rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{resolution} Resolution</span>
              </span>
            )}
          </div>

          {/* Canvas Display */}
          <div className="flex-1 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center relative overflow-hidden p-4 group">
            {isGenerating ? (
              <div className="text-center space-y-4 max-w-md p-6">
                <div className="w-16 h-16 border-4 border-[#c9a24b]/20 border-t-[#c9a24b] rounded-full animate-spin mx-auto" />
                <h4 className="text-base font-bold text-[#0f172a]">
                  Synthesizing {resolution} Eyewear Concept...
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Model <span className="font-semibold text-[#0f172a]">gemini-3-pro-image-preview</span> is rendering high-precision acetate bevels, titanium filigree, and studio lighting at {resolution} resolution.
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#c9a24b] h-full animate-pulse w-3/4" />
                </div>
              </div>
            ) : generatedImageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={generatedImageUrl}
                  alt="Custom Generated Frame Concept"
                  className="max-h-[460px] w-auto object-contain rounded-lg shadow-lg"
                />

                {/* Lightbox Zoom Overlay Button */}
                <button
                  onClick={() => setIsFullscreenZoom(true)}
                  className="absolute top-3 right-3 p-2 bg-[#0f172a]/80 hover:bg-[#0f172a] text-white rounded-lg backdrop-blur-sm transition-all"
                  title="Zoom High Resolution Image"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3 max-w-sm p-6 text-slate-400">
                <Image className="w-16 h-16 mx-auto stroke-1 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">
                  Ready to generate custom 1-of-1 frame
                </p>
                <p className="text-xs text-slate-400">
                  Choose your parameters and click <strong>"Synthesize {resolution} Frame Concept"</strong> to create bespoke high-resolution imagery.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer for Generated Image */}
          {generatedImageUrl && !isGenerating && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs text-slate-500 font-semibold uppercase">Est. Production Cost:</span>
                <p className="text-xl font-extrabold text-[#0f172a]">PKR 28,500</p>
                <span className="text-[10px] text-slate-400">Includes 1-of-1 Bespoke Milling & HD Prescription Lenses</span>
              </div>

              <div className="flex items-center gap-3">
                {onOpenVirtualTryOnWithImage && (
                  <button
                    onClick={() => onOpenVirtualTryOnWithImage(generatedImageUrl)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    Try Virtual Fitting
                  </button>
                )}

                <button
                  onClick={handleOrderCustomBespoke}
                  className="px-5 py-2.5 bg-[#c9a24b] hover:bg-amber-500 text-[#0f172a] text-xs font-bold rounded-lg shadow transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Bespoke Frame</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {isFullscreenZoom && generatedImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsFullscreenZoom(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-800">
            <img
              src={generatedImageUrl}
              alt="Full Resolution View"
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <a
                href={generatedImageUrl}
                download={`nazar-bespoke-${resolution}.png`}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-4 h-4" /> Download {resolution}
              </a>
              <button
                onClick={() => setIsFullscreenZoom(false)}
                className="p-2 bg-white text-black font-bold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
