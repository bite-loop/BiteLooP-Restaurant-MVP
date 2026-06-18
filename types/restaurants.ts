// types/restaurant.ts
import { Timestamp } from './common';

// ============ RESTAURANT RELATED ============
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  //auth field
  email: string; // Restaurant email for login
  password?: string; // Only used during signup, not stored
  displayName?: string; // Same as name
  photoURL?: string;
  
  // Ratings
  rating: number;
  totalRatings: number;
  reviewCount: number;
  
  // Delivery
  deliveryTime: string;
  estimatedDeliveryTime: number; // 30
  minOrder: number;
  deliveryFee: number;
  serviceFee: number;
  
  // Pricing
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  
  // Status
  featured: boolean;
  bannerColor?: string;
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Images
  images: {
    cover: string[];
    logo: string;
    gallery: string[];
  };
  
  // Operating Hours
  operatingHours: OperatingHours;
  isOpen: boolean;
  isActive: boolean;
  
  // Marketing
  popularItems: string[];
  tags: string[];
  averageOrderValue: number;
  
  // ============ RESTAURANT PORTAL FIELDS ============
  
  // Onboarding Status
  onboardingStatus: 'pending' | 'in_progress' | 'completed' | 'rejected';
  onboardingStep: number; // 1-4 steps
  completedAt?: Timestamp;
  approvedAt?: Timestamp;
  rejectedAt?: Timestamp;
  rejectionReason?: string;
  
  // Business Type
  businessType: 'delivery_only' | 'dine_only' | 'both';
  serviceTypes: {
    delivery: boolean;
    dineIn: boolean;
    takeaway: boolean;
  };
  
  // Business Details (Canada/Ontario specific)
 businessDetails: {
  legalName: string; // Legal business name
  businessNumber: string; // Ontario Business Number
  hstNumber?: string; // HST/GST Registration Number
  businessPhone: string;
  website?: string;
  yearEstablished?: number;
  numberOfLocations?: number;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
};
  
  // Bank Details (Canadian banking)
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    accountType: 'chequing' | 'savings' | 'business';
    transitNumber: string; // 5-digit branch number
    institutionNumber: string; // 3-digit institution number
    swiftCode?: string;
    isVerified: boolean;
    verifiedAt?: Timestamp;
  };
  
  // Contact Person
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    position: 'owner' | 'manager' | 'chef' | 'other';
  };
  
  // Restaurant Settings
  settings: {
    autoAcceptOrders: boolean;
    maxOrderCapacity: number;
    estimatedPrepTime: number; // minutes
    isVegetarianOnly: boolean;
    hasGlutenFreeOptions: boolean;
    acceptsReservations: boolean;
    cancellationPolicy: 'flexible' | 'moderate' | 'strict';
    paymentMethods: ('cash' | 'card' | 'online' | 'tap')[];
  };
  
  // Payout Settings
  payoutSettings: {
    autoPayoutEnabled: boolean;
    payoutFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    minimumPayoutAmount: number;
    lastPayoutDate?: Timestamp;
    nextPayoutDate?: Timestamp;
  };
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// ============ OPERATING HOURS ============
export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "22:00"
  breakTime?: {
    start: string;
    end: string;
  };
  isHoliday?: boolean;
  holidayNote?: string;
}

// ============ MENU RELATED ============
export interface Menu {
  restaurantId: string;
  categories: MenuCategory[];
  lastUpdated: Timestamp;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  category: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  containsAllergens: string[];
  isAvailable: boolean;
  isPopular: boolean;
  preparationTime: number;
  customizationOptions: CustomizationGroup[];
  nutritionalInfo?: NutritionalInfo;
  rating: number;
  numberOfRatings: number;
  // Menu management fields
  costToMake?: number;
  profitMargin?: number;
  hasLimitedStock?: boolean;
  stockQuantity?: number;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  additionalPrice: number;
  isDefault?: boolean;
}

export interface NutritionalInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

// ============ REVIEWS & RATINGS ============
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  restaurantId: string;
  orderId: string;
  rating: number;
  foodRating: number;
  deliveryRating: number;
  comment: string;
  images: string[];
  likes: number;
  restaurantReply?: {
    comment: string;
    repliedAt: Timestamp;
  };
  createdAt: Timestamp;
}

// ============ ONBOARDING FORM DATA ============

export interface OnboardingFormData {
  // Step 1: Business Type
  businessType: 'delivery_only' | 'dine_only' | 'both';
  serviceTypes: {
    delivery: boolean;
    dineIn: boolean;
    takeaway: boolean;
  };
  
  // Step 2: Business Details (Canada/Ontario)
  businessDetails: {
    legalName: string;
    businessNumber: string;
    hstNumber: string;
    businessPhone: string;
    website?: string;
    yearEstablished?: number;
    numberOfLocations?: number;
  };
  
  // Step 3: Bank Details (Canadian)
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    accountType: 'chequing' | 'savings' | 'business';
    transitNumber: string;
    institutionNumber: string;
  };
  
  // Step 4: Restaurant Profile
  restaurantProfile: {
    name: string;
    description: string;
    cuisine: string[];
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      latitude: number;
      longitude: number;
    };
    priceRange: "$" | "$$" | "$$$" | "$$$$";
    deliveryTime: string;
    estimatedDeliveryTime: number;
    minOrder: number;
    deliveryFee: number;
    serviceFee: number;
    operatingHours: OperatingHours;
    images: {
      logo: string;
      cover: string[];
      gallery: string[];
    };
  };
  
  // Step 5: Menu
  menu: {
    categories: MenuCategory[];
  };
  
  // Step 6: Review & Submit
  consent: boolean;
  termsAccepted: boolean;
  
  // Step 7: Waiting for Approval
  status: 'pending_approval' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  rejectionReason?: string;
  estimatedApprovalTime?: string;
}