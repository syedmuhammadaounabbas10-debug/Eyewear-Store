import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, Glasses, Home, FileText, Menu, X, Check, MapPin, Truck, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  setIsHomeTryOnOpen: (open: boolean) => void;
  setIsPrescriptionHubOpen: (open: boolean) => void;
  setIsOrderTrackingOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  setIsCartOpen,
  setIsHomeTryOnOpen,
  setIsPrescriptionHubOpen,
  setIsOrderTrackingOpen,
  setIsAuthOpen,
  onOpenAdmin,
  searchQuery,
  setSearchQuery,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isGuest, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-[#0f172a] text-white text-xs py-2 px-4">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs uppercase font-bold bg-[#c9a24b] text-[#0f172a]">
              FREE SHIPPING
            </span>
            <span>Complimentary Courier Delivery Across Pakistan on Orders Over PKR 10,000</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#c9a24b]" /> Lahore • Karachi • Islamabad
            </span>
            <span className="hidden md:inline">•</span>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="hover:text-white transition-colors text-[#c9a24b] font-bold"
            >
              Track Order Status
            </button>
            <span className="hidden md:inline">•</span>
            <button
              onClick={() => setIsHomeTryOnOpen(true)}
              className="hover:text-white transition-colors underline decoration-[#c9a24b]"
            >
              Book 3-Day Home Try-On
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="glass-nav border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-700 hover:text-black rounded-lg"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className="text-left group flex items-baseline gap-1 focus:outline-none"
            >
              <span className="font-extrabold tracking-[-0.03em] text-2xl sm:text-3xl text-[#0f172a] font-['Plus_Jakarta_Sans']">
                NAZAR
              </span>
              <span className="text-xs font-bold text-[#c9a24b] tracking-wider uppercase">
                .PK
              </span>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#0f172a] hover:bg-slate-100'
              }`}
            >
              Eyewear Catalog
            </button>

            <button
              onClick={() => setActiveTab('bespoke')}
              className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'bespoke'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-[#c9a24b] hover:bg-[#c9a24b]/10 border border-[#c9a24b]/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#c9a24b]" />
              <span>Custom Frame Studio (AI)</span>
              <span className="bg-[#c9a24b] text-[#0f172a] text-xs font-bold px-1.5 py-0.5 rounded-full uppercase">
                1K-4K
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tryon')}
              className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'tryon'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#0f172a] hover:bg-slate-100'
              }`}
            >
              <Glasses className="w-4 h-4 text-slate-500" />
              <span>Virtual Fitting</span>
            </button>

            <button
              onClick={() => setIsHomeTryOnOpen(true)}
              className="px-3.5 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-[#0f172a] hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Home Try-On</span>
            </button>

            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center gap-1.5 border border-slate-200"
            >
              <Truck className="w-3.5 h-3.5 text-[#c9a24b]" />
              <span>Track Order</span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-slate-700 hover:text-[#0f172a] rounded-md hover:bg-slate-100 transition-colors"
                title="Search Frames"
              >
                <Search className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Titanium, Acetate, Aviator..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]"
                      autoFocus
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-xs text-slate-500 flex justify-between items-center px-1">
                      <span>Filtering catalog...</span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setIsSearchOpen(false);
                        }}
                        className="text-[#0f172a] font-semibold underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Account / Auth Button */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-2 py-1 text-xs font-bold text-[#0f172a] hover:bg-slate-200 rounded flex items-center gap-1.5"
                  title="View Account Details"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#c9a24b]" />
                  <span className="max-w-[90px] truncate">
                    {user.displayName || (isGuest ? 'Guest' : user.email?.split('@')[0])}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-1 text-slate-500 hover:text-red-600 rounded hover:bg-slate-200"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0f172a] text-xs font-bold rounded-md border border-slate-200 transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#c9a24b]" />
                <span>Account</span>
              </button>
            )}

            {/* Currency Tag */}
            <span className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded">
              PKR ₨
            </span>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-semibold rounded-md transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#c9a24b]" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-[#c9a24b] text-[#0f172a] text-xs font-extrabold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
            <button
              onClick={() => {
                setActiveTab('catalog');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 text-left rounded-md text-sm font-semibold ${
                activeTab === 'catalog' ? 'bg-[#0f172a] text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              Eyewear Catalog
            </button>

            <button
              onClick={() => {
                setActiveTab('bespoke');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 text-left rounded-md text-sm font-semibold flex items-center justify-between ${
                activeTab === 'bespoke' ? 'bg-[#0f172a] text-white' : 'text-[#c9a24b] hover:bg-[#c9a24b]/10'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Custom Frame Studio (AI)
              </span>
              <span className="bg-[#c9a24b] text-[#0f172a] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                1K-4K
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tryon');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 text-left rounded-md text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'tryon' ? 'bg-[#0f172a] text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Glasses className="w-4 h-4" /> Virtual Fitting
            </button>

            <button
              onClick={() => {
                setIsHomeTryOnOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
            >
              <Home className="w-4 h-4" /> Book 3-Day Home Try-On
            </button>

            <button
              onClick={() => {
                setIsPrescriptionHubOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Prescription Hub
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};
