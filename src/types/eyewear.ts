export type FrameShape = 'Square' | 'Aviator' | 'Round' | 'Cat-Eye' | 'Geometric' | 'Clubmaster';
export type FrameMaterial = 'Italian Acetate' | 'Japanese Titanium' | '18K Gold Plated' | 'Eco Bio-Acetate';
export type FrameType = 'Prescription' | 'Sunglasses' | 'Blue Light' | 'Bespoke Atelier';
export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart';

export interface ColorSwatch {
  name: string;
  hex: string;
  image?: string;
}

export interface EyewearProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  pricePKR: number;
  originalPricePKR?: number;
  frameType: FrameType;
  frameShape: FrameShape;
  frameMaterial: FrameMaterial;
  colors: ColorSwatch[];
  selectedColorIndex?: number;
  dimensions: string; // e.g., "53 - 18 - 145 mm"
  lensWidthMm: number;
  bridgeWidthMm: number;
  templeLengthMm: number;
  suitableFaceShapes: FaceShape[];
  images: {
    front: string;
    angle: string;
    side: string;
    onModel: string;
  };
  tags: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
}

export interface LensOption {
  id: string;
  name: string;
  pricePKR: number;
  description: string;
}

export interface LensCoating {
  id: string;
  name: string;
  pricePKR: number;
  description: string;
}

export interface ManualPrescription {
  odSphere: string;
  odCyl: string;
  odAxis: string;
  odAdd?: string;
  osSphere: string;
  osCyl: string;
  osAxis: string;
  osAdd?: string;
  pd: string;
}

export interface PrescriptionData {
  method: 'upload' | 'manual' | 'whatsapp_later';
  fileUrl?: string;
  fileName?: string;
  manualData?: ManualPrescription;
  doctorNotes?: string;
}

export interface CustomFrameConfig {
  shape: string;
  material: string;
  color: string;
  lens: string;
  style: string;
  prompt: string;
  resolution: '1K' | '2K' | '4K';
  generatedImageUrl?: string;
}

export interface CartItem {
  cartItemId: string;
  product: EyewearProduct;
  selectedColor: ColorSwatch;
  lensOption: LensOption;
  lensCoating: LensCoating;
  prescription?: PrescriptionData;
  customFrameConfig?: CustomFrameConfig;
  quantity: number;
  totalPricePKR: number;
}

export type PaymentMethod = 'cod' | 'easypaisa' | 'bank_transfer';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderRecord {
  orderId: string;
  items: CartItem[];
  subtotalPKR: number;
  shippingPKR: number;
  discountPKR: number;
  totalPKR: number;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  paymentAccount?: string;
  paymentProofScreenshot?: string;
  trackingNumber: string;
  courier: string;
  status: 'Confirmed' | 'In Production' | 'Dispatched' | 'Delivered';
  createdAt: string;
}
