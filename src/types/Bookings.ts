
export interface Organizer {
  _id: string;
  givenName: string;
  familyName: string;
  profileImage?: string;
}

export interface Experience {
  timeLength: string;
  coverPhoto: string;
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  pricePerPerson: number;
  duration: number; // in minutes
  type: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  organizer: Organizer;
  rating?: number;
  availableDates?: string[];
  publicationStatus: 'draft' | 'pending' | 'published';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  page?: number;
  pages?: number;
  message?: string;
}

export interface BookingDetails {
  experience: Experience;
  date: string;
  time: string;
  quantity: number;
}

export interface UserInfo {
  name: string;
  email: string;
  promoCode?: string;
}

export interface PriceSummary {
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
}

export interface BookingConfirmation {
  bookingId: string;
  experience: string;
  date: string;
  time: string;
  quantity: number;
  total: number;
  status: 'success' | 'failure';
}