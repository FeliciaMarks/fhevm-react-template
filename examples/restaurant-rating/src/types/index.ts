export interface Restaurant {
  id: number;
  name: string;
  location: string;
  owner: string;
  isActive: boolean;
  totalReviews: number;
  createdAt: number;
}

export interface ReviewFormData {
  restaurantId: number;
  foodQuality: number;
  service: number;
  atmosphere: number;
  priceValue: number;
  overallRating: number;
  comment: string;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export interface StatusMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}
