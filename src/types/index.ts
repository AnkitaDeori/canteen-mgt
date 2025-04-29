export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready';

export interface Order {
  id: number;
  studentId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  timestamp: number;
}

export interface User {
  id: string;
  isAdmin: boolean;
}