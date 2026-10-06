import React, { useState, useMemo } from 'react';
import { EyewearProduct, FrameType, FaceShape, FrameMaterial } from '../types/eyewear';
import { Filter, Sparkles, Star, Eye, ShoppingBag, Check, SlidersHorizontal } from 'lucide-react';

interface CatalogProps {
  products: EyewearProduct[];
  searchQuery: string;
  onSelectProduct: (product: EyewearProduct) => void;
  onQuickAddToCart: (product: EyewearProduct) => void;
  onOpenVirtualTryOn: (product: EyewearProduct) => void;
  onOpenBespokeTab: () => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  searchQuery,
  onSelectProduct,
  onQuickAddToCart,
  onOpenVirtualTryOn,
  onOpenBespokeTab,
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedFaceShape, setSelectedFaceShape] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [activeColorIndices, setActiveColorIndices] = useState<Record<string, number>>({});

  const handleColorChange = (productId: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveColorIndices((prev) => ({ ...prev, [productId]: index }));
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchMat = p.frameMaterial.toLowerCase().includes(q);
          const matchShape = p.frameShape.toLowerCase().includes(q);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchMat && !matchShape && !matchTag) return false;
        }

        // Category Type Filter
        if (selectedType !== 'All') {
          if (selectedType === 'Prescription' && p.frameType !== 'Prescription') return false;
          if (selectedType === 'Sunglasses' && p.frameType !== 'Sunglasses') return false;
          if (selectedType === 'Blue Light' && p.frameType !== 'Blue Light') return false;
        }

        // Face Shape Filter
        if (selectedFaceShape !== 'All') {
          if (!p.suitableFaceShapes.includes(selectedFaceShape as FaceShape)) return false;
        }

        // Material Filter
        if (selectedMaterial !== 'All') {
          if (p.frameMaterial !== selectedMaterial) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.pricePKR - b.pricePKR;
        if (sortBy === 'price-high') return b.pricePKR - a.pricePKR;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, searchQuery, selectedType, selectedFaceShape, selectedMaterial, sortBy]);

  return (
    <section className="py-12 px-4 sm:px-8 max-w-[1360px] mx-auto text-left">
      {/* Title & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-[#c9a24b] tracking-widest uppercase">
            CURATED COLLECTION • WINTER '26
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight font-['Plus_Jakarta_Sans']">
            Architectural Eyewear
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Milled from Italian organic acetate and grade-5 Japanese titanium. Doctor verified prescription lenses included.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {['All', 'Prescription', 'Sunglasses', 'Blue Light'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-[#0f172a] text-white shadow'
                  : 'text-slate-600 hover:text-black hover:bg-slate-200/60'
              }`}
            >
              {type === 'All' ? 'All Eyewear' : type}
            </button>
          ))}

          <button
            onClick={onOpenBespokeTab}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#c9a24b] text-[#0f172a] hover:bg-amber-500 transition-all flex items-center gap-1 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Bespoke Studio</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="py-4 my-4 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0f172a]">
            <SlidersHorizontal className="w-4 h-4 text-[#c9a24b]" />
            <span>Filter By:</span>
          </div>

          {/* Face Shape Selector */}
          <select
            value={selectedFaceShape}
            onChange={(e) => setSelectedFaceShape(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:border-[#0f172a]"
          >
            <option value="All">Face Shape: All</option>
            <option value="Oval">Suitable for: Oval Face</option>
            <option value="Round">Suitable for: Round Face</option>
            <option value="Square">Suitable for: Square Face</option>
            <option value="Heart">Suitable for: Heart Face</option>
          </select>

          {/* Material Selector */}
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:border-[#0f172a]"
          >
            <option value="All">Material: All</option>
            <option value="Japanese Titanium">Japanese Titanium</option>
            <option value="Italian Acetate">Italian Acetate</option>
            <option value="18K Gold Plated">18K Gold Plated</option>
            <option value="Eco Bio-Acetate">Eco Bio-Acetate</option>
          </select>

          {(selectedFaceShape !== 'All' || selectedMaterial !== 'All' || selectedType !== 'All') && (
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedFaceShape('All');
                setSelectedMaterial('All');
              }}
              className="text-xs font-bold text-red-600 hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0f172a]"
          >
            <option value="featured">Featured Collection</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 my-8">
          <p className="text-lg font-bold text-slate-700">No frames match your filter criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting face shape or material filters, or create a custom frame in the AI Studio.</p>
          <button
            onClick={() => {
              setSelectedType('All');
              setSelectedFaceShape('All');
              setSelectedMaterial('All');
            }}
            className="mt-4 px-5 py-2 bg-[#0f172a] text-white text-xs font-bold rounded-lg"
          >
            Show All Frames
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-6">
          {filteredProducts.map((p) => {
            const activeColorIdx = activeColorIndices[p.id] ?? 0;
            const activeColor = p.colors[activeColorIdx] || p.colors[0];

            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative hover:-translate-y-1"
              >
                {/* Image Container with Hover Flip */}
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden p-4 border-b border-slate-100">
                  {/* Tags */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                    {p.isBestseller && (
                      <span className="bg-[#c9a24b] text-[#0f172a] text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow">
                        Bestseller
                      </span>
                    )}
                    {p.isNew && (
                      <span className="bg-[#0f172a] text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        New Winter '26
                      </span>
                    )}
                  </div>

                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{p.rating}</span>
                  </div>

                  {/* Primary Front Image */}
                  <img
                    src={p.images.front}
                    alt={p.name}
                    className="w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0"
                  />

                  {/* Hover On-Model Image */}
                  <img
                    src={p.images.onModel}
                    alt={`${p.name} on model`}
                    className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  {/* Hover Virtual Try-On Bar */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVirtualTryOn(p);
                      }}
                      className="flex-1 py-1.5 bg-[#0f172a]/90 hover:bg-[#0f172a] text-white text-xs font-bold rounded-lg backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors shadow"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#c9a24b]" />
                      <span>Virtual Fitting</span>
                    </button>
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Material Subtitle & Dimension */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
                      <span>{p.frameMaterial}</span>
                      <span className="text-slate-400">{p.dimensions}</span>
                    </div>

                    {/* Frame Name */}
                    <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#c9a24b] transition-colors font-['Plus_Jakarta_Sans']">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.subtitle}</p>
                  </div>

                  {/* Color Swatch Dots */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {p.colors.map((c, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => handleColorChange(p.id, idx, e)}
                          title={c.name}
                          className={`w-4 h-4 rounded-full border transition-all ${
                            activeColorIdx === idx
                              ? 'ring-2 ring-[#0f172a] ring-offset-1 scale-110'
                              : 'border-slate-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 font-medium ml-1">
                        {activeColor.name}
                      </span>
                    </div>
                  </div>

                  {/* Price & Quick Add Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        PKR
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                          {p.pricePKR.toLocaleString()}
                        </span>
                        {p.originalPricePKR && (
                          <span className="text-xs text-slate-400 line-through">
                            {p.originalPricePKR.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAddToCart(p);
                      }}
                      className="px-3.5 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                      title="Add frame to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#c9a24b]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
