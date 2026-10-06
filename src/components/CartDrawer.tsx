import React, { useState } from 'react';
import { CartItem } from '../types/eyewear';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscountPKR, setAppliedDiscountPKR] = useState<number>(0);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string | null>(null);

  const subtotalPKR = cartItems.reduce((acc, item) => acc + item.totalPricePKR * item.quantity, 0);
  const shippingPKR = subtotalPKR > 10000 || cartItems.length === 0 ? 0 : 250;
  const grandTotalPKR = Math.max(0, subtotalPKR + shippingPKR - appliedDiscountPKR);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'NAZAR10') {
      const discount = Math.round(subtotalPKR * 0.1);
      setAppliedDiscountPKR(discount);
      setPromoSuccessMsg('10% VIP Discount Applied!');
    } else if (code === 'WELCOMEPK') {
      setAppliedDiscountPKR(1500);
      setPromoSuccessMsg('PKR 1,500 Welcome Voucher Applied!');
    } else {
      alert('Invalid coupon code. Try NAZAR10 or WELCOMEPK');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between text-left relative overflow-hidden">
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#0f172a] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#c9a24b]" />
            <h3 className="font-extrabold text-lg font-['Plus_Jakarta_Sans']">Your Shopping Bag</h3>
            <span className="bg-[#c9a24b] text-[#0f172a] text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-3">
              <ShoppingBag className="w-16 h-16 mx-auto stroke-1 text-slate-300" />
              <p className="text-base font-bold text-slate-700">Your shopping bag is empty.</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our handcrafted Italian acetate & Japanese titanium frames or design a custom AI frame.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 relative group"
              >
                <img
                  src={item.product.images.front}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain bg-white rounded-lg border border-slate-200 p-1 shrink-0"
                />

                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex items-start justify-between pr-6">
                    <h4 className="font-bold text-[#0f172a] text-sm font-['Plus_Jakarta_Sans']">
                      {item.product.name}
                    </h4>
                  </div>

                  <p className="text-slate-500 text-[11px]">
                    Finish: <span className="font-semibold text-slate-700">{item.selectedColor.name}</span>
                  </p>

                  <p className="text-slate-500 text-[11px]">
                    Lens: <span className="font-semibold text-slate-700">{item.lensOption.name}</span>
                  </p>

                  {item.lensCoating.pricePKR > 0 && (
                    <p className="text-slate-500 text-[11px]">
                      Coating: <span className="font-semibold text-slate-700">{item.lensCoating.name}</span>
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-[#0f172a]">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-extrabold text-sm text-[#0f172a]">
                      PKR {(item.totalPricePKR * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.cartItemId)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-4 shadow-lg">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. NAZAR10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0f172a] text-white text-xs font-bold rounded-lg hover:bg-[#1e293b]"
              >
                Apply
              </button>
            </form>

            {promoSuccessMsg && (
              <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {promoSuccessMsg}
              </p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">PKR {subtotalPKR.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Express Courier Shipping (Pakistan)</span>
                <span className="font-semibold text-slate-800">
                  {shippingPKR === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `PKR ${shippingPKR}`}
                </span>
              </div>

              {appliedDiscountPKR > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>- PKR {appliedDiscountPKR.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-extrabold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                <span>Grand Total</span>
                <span className="text-[#c9a24b]">PKR {grandTotalPKR.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#c9a24b]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
