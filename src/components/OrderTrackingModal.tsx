import React, { useState } from 'react';
import { OrderRecord } from '../types/eyewear';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, MapPin, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders?: OrderRecord[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  recentOrders = [],
}) => {
  if (!isOpen) return null;

  const [inputOrderId, setInputOrderId] = useState<string>('');
  const [searchedOrder, setSearchedOrder] = useState<OrderRecord | null>(
    recentOrders.length > 0 ? recentOrders[recentOrders.length - 1] : null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Default Sample Orders if user searches sample IDs
  const SAMPLE_MOCK_ORDERS: Record<string, OrderRecord> = {
    'NZR-98421-PK': {
      orderId: 'NZR-98421-PK',
      items: [],
      subtotalPKR: 18500,
      shippingPKR: 0,
      discountPKR: 0,
      totalPKR: 18500,
      customer: {
        fullName: 'Syed Ali Hassan',
        email: 'ali@example.com',
        phone: '0300 1234567',
        whatsapp: '0300 1234567',
        city: 'Lahore',
        address: 'House # 42, Block C2, Gulberg III',
      },
      paymentMethod: 'cod',
      trackingNumber: 'TCS-98213840',
      courier: 'TCS Express Courier',
      status: 'In Production',
      createdAt: 'Oct 6, 2026',
    },
    'NZR-45120-PK': {
      orderId: 'NZR-45120-PK',
      items: [],
      subtotalPKR: 21000,
      shippingPKR: 0,
      discountPKR: 0,
      totalPKR: 21000,
      customer: {
        fullName: 'Fatima Zahra',
        email: 'fatima@example.com',
        phone: '0321 9876543',
        whatsapp: '0321 9876543',
        city: 'Islamabad',
        address: 'Street 14, Sector F-7/2',
      },
      paymentMethod: 'easypaisa',
      trackingNumber: 'TCS-10492810',
      courier: 'TCS Express Courier',
      status: 'Dispatched',
      createdAt: 'Oct 5, 2026',
    },
    'NZR-88319-PK': {
      orderId: 'NZR-88319-PK',
      items: [],
      subtotalPKR: 16500,
      shippingPKR: 0,
      discountPKR: 0,
      totalPKR: 16500,
      customer: {
        fullName: 'Usman Chaudhry',
        email: 'usman@example.com',
        phone: '0333 5551234',
        whatsapp: '0333 5551234',
        city: 'Karachi',
        address: 'Apartment 4B, DHA Phase 6',
      },
      paymentMethod: 'bank_transfer',
      trackingNumber: 'TCS-77291039',
      courier: 'TCS Express Courier',
      status: 'Delivered',
      createdAt: 'Oct 3, 2026',
    },
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const formattedId = inputOrderId.trim().toUpperCase();

    if (!formattedId) {
      setErrorMsg('Please enter an Order ID e.g. NZR-98421-PK');
      return;
    }

    // Check user placed orders first
    const foundUserOrder = recentOrders.find(
      (o) => o.orderId.toUpperCase() === formattedId
    );

    if (foundUserOrder) {
      setSearchedOrder(foundUserOrder);
      return;
    }

    // Check mock sample database
    if (SAMPLE_MOCK_ORDERS[formattedId]) {
      setSearchedOrder(SAMPLE_MOCK_ORDERS[formattedId]);
      return;
    }

    // Generate dynamic realistic order if ID matches NZR format
    if (formattedId.startsWith('NZR-') || formattedId.length >= 6) {
      const generatedOrder: OrderRecord = {
        orderId: formattedId,
        items: [],
        subtotalPKR: 18500,
        shippingPKR: 0,
        discountPKR: 0,
        totalPKR: 18500,
        customer: {
          fullName: 'Valued Customer',
          email: 'customer@nazar.pk',
          phone: '0300 1234567',
          whatsapp: '0300 1234567',
          city: 'Lahore',
          address: 'Main Boulevard, Gulberg III',
        },
        paymentMethod: 'cod',
        trackingNumber: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
        courier: 'TCS Express Courier',
        status: 'In Production',
        createdAt: 'Oct 6, 2026',
      };
      setSearchedOrder(generatedOrder);
    } else {
      setErrorMsg('Order ID not found. Please try NZR-98421-PK or check your confirmation email.');
    }
  };

  const getTimelineSteps = (status: OrderRecord['status']) => {
    const steps = [
      {
        title: 'Order Confirmed & Optometry Audit',
        desc: 'Prescription verified by optometrist in Lahore atelier.',
        date: 'Oct 6, 2026',
        completed: true,
      },
      {
        title: 'Precision Lens Milling & Assembly',
        desc: 'Custom HD lenses mounted in handcrafted frame.',
        date: status === 'Confirmed' ? 'In Progress' : 'Completed',
        completed: status !== 'Confirmed',
        active: status === 'In Production',
      },
      {
        title: 'Dispatched via TCS Express Courier',
        desc: 'Handed over to courier partner for fast delivery.',
        date: status === 'Dispatched' || status === 'Delivered' ? 'Completed' : 'Pending',
        completed: status === 'Dispatched' || status === 'Delivered',
        active: status === 'Dispatched',
      },
      {
        title: 'Doorstep Delivery Inspection',
        desc: 'Courier agent delivers package to your address.',
        date: status === 'Delivered' ? 'Delivered' : 'Est. 24-48 Hours',
        completed: status === 'Delivered',
      },
    ];

    return steps;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#c9a24b] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#c9a24b]" />
              <span>LIVE ORDER TRACKING • PAKISTAN</span>
            </span>
            <h2 className="text-2xl font-extrabold text-[#0f172a] mt-1 font-['Plus_Jakarta_Sans']">
              Track Your Eyewear Order
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your Order ID (e.g. <code className="text-[#0f172a] font-bold">NZR-98421-PK</code>) to view prescription status, lens milling progress, and courier delivery timeframe.
            </p>
          </div>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. NZR-98421-PK)"
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:border-[#0f172a]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                Track Order
              </button>
            </div>

            {/* Quick Sample ID Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span className="font-semibold">Sample IDs:</span>
              {['NZR-98421-PK', 'NZR-45120-PK', 'NZR-88319-PK'].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setInputOrderId(id);
                    setSearchedOrder(SAMPLE_MOCK_ORDERS[id]);
                  }}
                  className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold rounded border border-slate-200"
                >
                  {id}
                </button>
              ))}
            </div>

            {errorMsg && <p className="text-xs text-red-600 font-bold pt-1">{errorMsg}</p>}
          </form>

          {/* Order Details Display */}
          {searchedOrder && (
            <div className="space-y-6 pt-4 border-t border-slate-200 animate-in fade-in">
              {/* Order Status Banner */}
              <div className="bg-[#0f172a] text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#c9a24b] uppercase font-mono">
                      {searchedOrder.orderId}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-300">{searchedOrder.createdAt}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans']">
                    Status: <span className="text-[#c9a24b]">{searchedOrder.status}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Courier: {searchedOrder.courier} ({searchedOrder.trackingNumber})
                  </p>
                </div>

                <a
                  href={`https://wa.me/923245908220?text=${encodeURIComponent(
                    `Hi Nazar.pk, please provide live courier update for my order ID ${searchedOrder.orderId}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow shrink-0"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WhatsApp Updates</span>
                </a>
              </div>

              {/* Progress Timeline Steps */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#c9a24b]" />
                  <span>Order Lifecycle Progress</span>
                </h4>

                <div className="space-y-4 pt-2">
                  {getTimelineSteps(searchedOrder.status).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative">
                      {/* Status Icon */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          step.completed
                            ? 'bg-emerald-600 text-white'
                            : step.active
                            ? 'bg-[#c9a24b] text-[#0f172a] animate-pulse ring-2 ring-[#c9a24b]/40'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#0f172a]">
                          <span>{step.title}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{step.date}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination & Delivery Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Delivery Address:</span>
                  <p className="font-bold text-[#0f172a]">{searchedOrder.customer.fullName}</p>
                  <p className="text-slate-600">{searchedOrder.customer.address}</p>
                  <p className="text-slate-600 font-semibold">{searchedOrder.customer.city}, Pakistan</p>
                  <p className="text-slate-500 text-[11px] pt-1">Phone: {searchedOrder.customer.phone}</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Delivery Timeframe:</span>
                  <p className="font-bold text-[#0f172a] text-sm">
                    {searchedOrder.customer.city === 'Lahore'
                      ? '24-36 Hours (Express Lahore Dispatch)'
                      : searchedOrder.customer.city === 'Karachi' || searchedOrder.customer.city === 'Islamabad'
                      ? '2-3 Days (TCS Air Courier)'
                      : '3-4 Days (Standard Courier)'}
                  </p>
                  <p className="text-slate-500 text-[11px] pt-1">
                    Payment Method: <strong className="uppercase text-[#0f172a]">{searchedOrder.paymentMethod}</strong>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Total Amount: <strong className="text-[#c9a24b]">PKR {searchedOrder.totalPKR.toLocaleString()}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
