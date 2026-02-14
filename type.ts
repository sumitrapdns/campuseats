export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Burgers' | 'Pizza' | 'Sushi' | 'Salads' | 'Desserts' | 'Drinks';
  image: string;
  calories: number;
  rating: number;
  tags: string[];
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface DeliveryLocation {
  address: string;
  lat?: number;
  lng?: number;
  insight?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  timestamp: number;
  location: DeliveryLocation;
}

export enum View {
  MENU = 'menu',
  CART = 'cart',
  ORDERS = 'orders',
  AI_CHAT = 'ai_chat',
  CONTACT = 'contact'
}
