import React, { useState } from 'react';
import { EyewearProduct, CartItem, LensOption, LensCoating, PrescriptionData, OrderRecord } from './types/eyewear';
import { PRODUCTS, LENS_OPTIONS, LENS_COATINGS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { BespokeStudio } from './components/BespokeStudio';
import { VirtualTryOn } from './components/VirtualTryOn';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomeTryOnModal } from './components/HomeTryOnModal';
import { PrescriptionHub } from './components/PrescriptionHub';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WhatsAppConcierge } from './components/WhatsAppConcierge';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { db } from './lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catalogProducts, setCatalogProducts] = useState<EyewearProduct[]>(PRODUCTS);

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Modals & Tools
  const { user } = useAuth();
  const [placedOrders, setPlacedOrders] = useState<OrderRecord[]>([]);
  const [selectedProductPDP, setSelectedProductPDP] = useState<EyewearProduct | null>(null);
  const [virtualTryOnProduct, setVirtualTryOnProduct] = useState<EyewearProduct | null>(null);
  const [customGeneratedImageForTryOn, setCustomGeneratedImageForTryOn] = useState<string | null>(null);
  const [isHomeTryOnOpen, setIsHomeTryOnOpen] = useState<boolean>(false);
  const [isPrescriptionHubOpen, setIsPrescriptionHubOpen] = useState<boolean>(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Add standard product to cart
  const handleAddToCart = (
    product: EyewearProduct,
    colorIndex: number = 0,
    lensOption: LensOption = LENS_OPTIONS[0],
    lensCoating: LensCoating = LENS_COATINGS[0],
    prescription?: PrescriptionData
  ) => {
    const color = product.colors[colorIndex] || product.colors[0];
    const itemPrice = product.pricePKR + lensOption.pricePKR + lensCoating.pricePKR;

    const newItem: CartItem = {
      cartItemId: `${product.id}-${color.name}-${lensOption.id}-${lensCoating.id}-${Date.now()}`,
      product,
      selectedColor: color,
      lensOption,
      lensCoating,
      prescription,
      quantity: 1,
      totalPricePKR: itemPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Add bespoke custom generated frame to cart
  const handleAddCustomFrameToCart = (
    customProduct: EyewearProduct,
    resolution: '1K' | '2K' | '4K',
    imageUrl: string
  ) => {
    const newItem: CartItem = {
      cartItemId: customProduct.id,
      product: customProduct,
      selectedColor: customProduct.colors[0],
      lensOption: LENS_OPTIONS[0],
      lensCoating: LENS_COATINGS[0],
      customFrameConfig: {
        shape: customProduct.frameShape,
        material: customProduct.frameMaterial,
        color: customProduct.colors[0].name,
        lens: 'Clear HD',
        style: 'Bespoke 1-of-1 Milling',
        prompt: customProduct.description,
        resolution,
        generatedImageUrl: imageUrl,
      },
      quantity: 1,
      totalPricePKR: customProduct.pricePKR,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (cartItemId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleOpenVirtualTryOn = (product: EyewearProduct) => {
    setVirtualTryOnProduct(product);
    setActiveTab('tryon');
  };

  const handleOpenVirtualTryOnWithCustomImage = (imageUrl: string) => {
    setCustomGeneratedImageForTryOn(imageUrl);
    setActiveTab('tryon');
  };

  const handleOrderComplete = async (order: OrderRecord) => {
    setPlacedOrders((prev) => [...prev, order]);
    setCartItems([]);

    // Save order document to Firestore
    try {
      if (user) {
        await setDoc(doc(db, 'orders', order.orderId), {
          ...order,
          userId: user.uid,
          userEmail: user.email || 'guest@nazar.pk',
        });
      }
    } catch (err) {
      console.warn('Firestore order sync note:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0f172a] font-['Plus_Jakarta_Sans'] flex flex-col justify-between">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        setIsCartOpen={setIsCartOpen}
        setIsHomeTryOnOpen={setIsHomeTryOnOpen}
        setIsPrescriptionHubOpen={setIsPrescriptionHubOpen}
        setIsOrderTrackingOpen={setIsOrderTrackingOpen}
        setIsAuthOpen={setIsAuthOpen}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <>
            <Hero
              onExploreCatalog={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenBespoke={() => setActiveTab('bespoke')}
              onOpenHomeTryOn={() => setIsHomeTryOnOpen(true)}
            />

            <div id="catalog-section">
              <Catalog
                products={catalogProducts}
                searchQuery={searchQuery}
                onSelectProduct={(p) => setSelectedProductPDP(p)}
                onQuickAddToCart={(p) => handleAddToCart(p)}
                onOpenVirtualTryOn={handleOpenVirtualTryOn}
                onOpenBespokeTab={() => setActiveTab('bespoke')}
              />
            </div>
          </>
        )}

        {/* Bespoke AI Frame Studio */}
        {activeTab === 'bespoke' && (
          <BespokeStudio
            onAddCustomFrameToCart={handleAddCustomFrameToCart}
            onOpenVirtualTryOnWithImage={handleOpenVirtualTryOnWithCustomImage}
          />
        )}

        {/* Virtual Fitting Mirror */}
        {activeTab === 'tryon' && (
          <VirtualTryOn
            initialProduct={virtualTryOnProduct}
            customImageUrl={customGeneratedImageForTryOn}
            onSelectProduct={(p) => setSelectedProductPDP(p)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppConcierge />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductPDP}
        onClose={() => setSelectedProductPDP(null)}
        onAddToCart={handleAddToCart}
        onOpenVirtualTryOn={handleOpenVirtualTryOn}
        onOpenPrescriptionHub={() => setIsPrescriptionHubOpen(true)}
      />

      <HomeTryOnModal
        isOpen={isHomeTryOnOpen}
        onClose={() => setIsHomeTryOnOpen(false)}
      />

      <PrescriptionHub
        isOpen={isPrescriptionHubOpen}
        onClose={() => setIsPrescriptionHubOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        recentOrders={placedOrders}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {isAdminOpen && (
        <AdminDashboard
          products={catalogProducts}
          setProducts={setCatalogProducts}
          orders={placedOrders}
          setOrders={setPlacedOrders}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
