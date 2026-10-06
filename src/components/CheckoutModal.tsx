import React, { useState } from 'react';
import { CartItem, PaymentMethod, OrderRecord, CustomerDetails } from '../types/eyewear';
import { PAKISTAN_CITIES } from '../data/products';
import { X, CheckCircle2, Banknote, PhoneCall, Building2, Copy, Check, MessageSquare, Upload, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: 'Lahore',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [easypaisaSenderNum, setEasypaisaSenderNum] = useState<string>('');
  const [bankTxRef, setBankTxRef] = useState<string>('');
  
  // Screenshot Upload State
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Copy status indicators
  const [copiedEasypaisaNum, setCopiedEasypaisaNum] = useState<boolean>(false);
  const [copiedBankIBAN, setCopiedBankIBAN] = useState<boolean>(false);
  const [copiedAccountNum, setCopiedAccountNum] = useState<boolean>(false);

  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  const subtotalPKR = cartItems.reduce((acc, item) => acc + item.totalPricePKR * item.quantity, 0);
  const shippingPKR = subtotalPKR > 10000 ? 0 : 250;
  const totalPKR = subtotalPKR + shippingPKR;

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.fullName || !customer.phone || !customer.address) {
      alert('Please fill in required name, phone, and address details.');
      return;
    }

    if (paymentMethod === 'easypaisa' && !screenshotPreview && !easypaisaSenderNum) {
      if (!confirm('Proceeding without attaching Easypaisa payment screenshot? You can also send the screenshot later via WhatsApp (03245908220).')) {
        return;
      }
    }

    if (paymentMethod === 'bank_transfer' && !screenshotPreview && !bankTxRef) {
      if (!confirm('Proceeding without attaching Bank Transfer screenshot or Ref ID? You can also send the receipt screenshot later via WhatsApp (03245908220).')) {
        return;
      }
    }

    const newOrder: OrderRecord = {
      orderId: `NZR-${Math.floor(10000 + Math.random() * 90000)}-PK`,
      items: cartItems,
      subtotalPKR,
      shippingPKR,
      discountPKR: 0,
      totalPKR,
      customer,
      paymentMethod,
      paymentAccount: easypaisaSenderNum || bankTxRef || undefined,
      paymentProofScreenshot: screenshotPreview || undefined,
      trackingNumber: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier: 'TCS Express Courier',
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setCompletedOrder(newOrder);
    onOrderComplete(newOrder);
  };

  const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close checkout modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedOrder ? (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#c9a24b] tracking-wide">
                Secure Checkout • Pakistan
              </span>
              <h2 className="text-2xl font-extrabold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                Complete Your Eyewear Order
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Enter your shipping address in Pakistan and select your payment method.
              </p>
            </div>

            {/* Prominent WhatsApp Confirmation Note */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">WhatsApp Confirmation Note:</span>
                <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                  Aap ka order <strong>WhatsApp (03245908220)</strong> par confirm hoga. Order status aur tracking updates bhi WhatsApp par send kiye jayenge.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Contact & Address */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-sm font-bold text-[#0f172a] border-b border-slate-200 pb-2">
                  1. Shipping & Delivery Address
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Syed Muhammad Ali"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0300 1234567"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0324 5908220"
                        value={customer.whatsapp || customer.phone}
                        onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                      <select
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0f172a]"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email (Receipt)</label>
                      <input
                        type="email"
                        placeholder="ali@example.com"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Complete House / Office Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Plot #, Street, Block, Phase / Colony"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f172a] resize-none"
                    />
                  </div>
                </div>

                {/* Localized Payment Switcher (ONLY 3 Options: COD, Easypaisa, Bank Transfer) */}
                <h3 className="text-sm font-bold text-[#0f172a] border-b border-slate-200 pb-2 pt-2">
                  2. Select Payment Method
                </h3>

                <div className="space-y-3">
                  {/* Option 1: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'cod' ? 'border-[#0f172a] bg-slate-900 text-white shadow' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className={`w-5 h-5 shrink-0 mt-0.5 ${paymentMethod === 'cod' ? 'text-[#c9a24b]' : 'text-slate-600'}`} />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span>Cash on Delivery (COD)</span>
                        <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded">MOST POPULAR</span>
                      </div>
                      <p className={`text-[11px] mt-0.5 ${paymentMethod === 'cod' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Pay in cash upon inspecting your frames at your doorstep.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Easypaisa */}
                  <div
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'easypaisa' ? 'border-[#0f172a] bg-slate-900 text-white shadow' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <PhoneCall className={`w-5 h-5 shrink-0 mt-0.5 ${paymentMethod === 'easypaisa' ? 'text-[#c9a24b]' : 'text-slate-600'}`} />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span>Easypaisa Mobile Account</span>
                        <span className="text-[10px] bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded">03245908220</span>
                      </div>
                      <p className={`text-[11px] mt-0.5 ${paymentMethod === 'easypaisa' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Send total amount via Easypaisa app to the details below.
                      </p>

                      {paymentMethod === 'easypaisa' && (
                        <div className="mt-3 p-3.5 bg-slate-800 rounded-xl text-[11px] space-y-2.5 border border-slate-700 text-slate-200">
                          <p className="font-bold text-[#c9a24b]">Easypaisa Account Details:</p>
                          
                          <div className="space-y-1">
                            <p><span className="text-slate-400">Account Title:</span> <strong className="text-white">Syed Muhammad Aun Abbas</strong></p>
                            <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-700 font-mono text-xs">
                              <span>Number: <strong className="text-amber-300">03245908220</strong></span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard('03245908220', setCopiedEasypaisaNum);
                                }}
                                className="text-amber-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                              >
                                {copiedEasypaisaNum ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedEasypaisaNum ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-300 block mb-1">
                              Your Easypaisa Sender Number / Transaction ID:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 03xx-xxxxxxx or TRX # 9821"
                              value={easypaisaSenderNum}
                              onChange={(e) => setEasypaisaSenderNum(e.target.value)}
                              className="w-full p-2 text-xs text-black bg-white border border-slate-300 rounded focus:outline-none"
                            />
                          </div>

                          {/* Screenshot Upload Field for Easypaisa */}
                          <div className="pt-2 border-t border-slate-700">
                            <label className="font-bold text-amber-300 block mb-1.5 flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Payment Screenshot (Required for Instant Dispatch):</span>
                            </label>
                            
                            <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-600 hover:border-amber-400 bg-slate-900 rounded-lg cursor-pointer transition-colors text-center">
                              {screenshotPreview ? (
                                <div className="flex items-center gap-3 w-full">
                                  <img src={screenshotPreview} alt="Payment Proof" className="w-12 h-12 object-cover rounded border border-amber-400" />
                                  <div className="text-left flex-1">
                                    <p className="font-bold text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Attached
                                    </p>
                                    <p className="text-[10px] text-slate-400">Click to change file ({screenshotFile?.name})</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <ImageIcon className="w-6 h-6 text-amber-400 mx-auto" />
                                  <p className="text-xs font-semibold text-slate-200">Click to upload Easypaisa transfer screenshot</p>
                                  <p className="text-[10px] text-slate-400">JPG, PNG, or PDF screenshot from Easypaisa app</p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleScreenshotUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Option 3: Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'bank_transfer' ? 'border-[#0f172a] bg-slate-900 text-white shadow' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 shrink-0 mt-0.5 ${paymentMethod === 'bank_transfer' ? 'text-[#c9a24b]' : 'text-slate-600'}`} />
                    <div className="flex-1 text-xs">
                      <div className="font-bold">Meezan Bank Direct Transfer</div>
                      <p className={`text-[11px] mt-0.5 ${paymentMethod === 'bank_transfer' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Online banking, mobile app, or ATM transfer details below.
                      </p>

                      {paymentMethod === 'bank_transfer' && (
                        <div className="mt-3 p-3.5 bg-slate-800 rounded-xl text-[11px] space-y-2.5 border border-slate-700 text-slate-200">
                          <p className="font-bold text-[#c9a24b]">Bank Account Details:</p>
                          
                          <div className="space-y-1.5">
                            <p><span className="text-slate-400">Bank:</span> <strong className="text-white">Meezan Bank</strong></p>
                            <p><span className="text-slate-400">Account Title:</span> <strong className="text-white">Syed Muhammad Aun Abbas</strong></p>
                            
                            {/* IBAN Copy Box */}
                            <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-700 font-mono text-[11px]">
                              <span>IBAN: <strong className="text-amber-300">PK30MEZN0011560116132159</strong></span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard('PK30MEZN0011560116132159', setCopiedBankIBAN);
                                }}
                                className="text-amber-400 font-bold hover:underline flex items-center gap-1 shrink-0 ml-1"
                              >
                                {copiedBankIBAN ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedBankIBAN ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>

                            {/* Account Number Copy Box */}
                            <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-700 font-mono text-[11px]">
                              <span>Account No: <strong className="text-amber-300">11560116132159</strong></span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard('11560116132159', setCopiedAccountNum);
                                }}
                                className="text-amber-400 font-bold hover:underline flex items-center gap-1 shrink-0 ml-1"
                              >
                                {copiedAccountNum ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedAccountNum ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-300 block mb-1">
                              Bank Reference / Transaction ID:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. TRX # 98127391823"
                              value={bankTxRef}
                              onChange={(e) => setBankTxRef(e.target.value)}
                              className="w-full p-2 text-xs text-black bg-white border border-slate-300 rounded focus:outline-none"
                            />
                          </div>

                          {/* Screenshot Upload Field for Bank Transfer */}
                          <div className="pt-2 border-t border-slate-700">
                            <label className="font-bold text-amber-300 block mb-1.5 flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Bank Transfer Receipt Screenshot:</span>
                            </label>
                            
                            <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-600 hover:border-amber-400 bg-slate-900 rounded-lg cursor-pointer transition-colors text-center">
                              {screenshotPreview ? (
                                <div className="flex items-center gap-3 w-full">
                                  <img src={screenshotPreview} alt="Payment Proof" className="w-12 h-12 object-cover rounded border border-amber-400" />
                                  <div className="text-left flex-1">
                                    <p className="font-bold text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Attached
                                    </p>
                                    <p className="text-[10px] text-slate-400">Click to change file ({screenshotFile?.name})</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <ImageIcon className="w-6 h-6 text-amber-400 mx-auto" />
                                  <p className="text-xs font-semibold text-slate-200">Click to upload bank transfer receipt screenshot</p>
                                  <p className="text-[10px] text-slate-400">JPG, PNG, or PDF screenshot from banking app</p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleScreenshotUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-bold text-[#0f172a] text-sm border-b border-slate-200 pb-2 font-['Plus_Jakarta_Sans']">
                    Order Summary ({cartItems.length} items)
                  </h3>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <img src={item.product.images.front} alt={item.product.name} className="w-10 h-8 object-contain bg-white rounded border" />
                          <div>
                            <p className="font-bold text-[#0f172a]">{item.product.name}</p>
                            <p className="text-[10px] text-slate-500">{item.selectedColor.name} x {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#0f172a]">
                          PKR {(item.totalPricePKR * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-800">PKR {subtotalPKR.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Express Courier</span>
                      <span className="font-bold text-emerald-600">{shippingPKR === 0 ? 'FREE' : `PKR ${shippingPKR}`}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-slate-300 text-base font-extrabold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                      <span>Total Amount</span>
                      <span className="text-[#c9a24b]">PKR {totalPKR.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 text-center font-medium">
                    WhatsApp confirmation on <strong>03245908220</strong> upon order placement.
                  </p>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                  >
                    Confirm & Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Order Confirmation Screen */
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                Order Confirmed
              </span>
              <h2 className="text-3xl font-extrabold text-[#0f172a] mt-2 font-['Plus_Jakarta_Sans']">
                Thank You, {completedOrder.customer.fullName}!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your optical order <strong className="text-[#0f172a]">{completedOrder.orderId}</strong> has been logged into our Lahore milling atelier.
              </p>
            </div>

            {/* Confirmation Note */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 max-w-md mx-auto flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Aap ka order <strong>WhatsApp (03245908220)</strong> par confirm ho gaya hai!</span>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-bold text-[#0f172a] font-mono">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Number:</span>
                <span className="font-bold text-[#0f172a] font-mono">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Courier Partner:</span>
                <span className="font-bold text-[#0f172a]">{completedOrder.courier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-bold text-[#0f172a]">{completedOrder.customer.address}, {completedOrder.customer.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-bold text-[#0f172a] uppercase">
                  {completedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : completedOrder.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'Meezan Bank Transfer'}
                </span>
              </div>
              {completedOrder.paymentProofScreenshot && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-emerald-700 font-bold">
                  <span>Payment Screenshot:</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Attached</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-[#0f172a]">
                <span>Total Amount:</span>
                <span className="text-[#c9a24b]">PKR {completedOrder.totalPKR.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/923245908220?text=${encodeURIComponent(
                  `Hi Nazar.pk, I have placed order ${completedOrder.orderId} for PKR ${completedOrder.totalPKR}. Payment Mode: ${completedOrder.paymentMethod.toUpperCase()}. Customer: ${completedOrder.customer.fullName} (${completedOrder.customer.city}).`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Confirm Order on WhatsApp (03245908220)</span>
              </a>

              <button onClick={onClose} className="px-6 py-3 bg-[#0f172a] text-white text-xs font-bold rounded-xl">
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
