import { MenuItem, Order, OrderStatus } from '../types';

// Mock database using localStorage
const MENU_ITEMS_KEY = 'canteen_menu_items';
const ORDERS_KEY = 'canteen_orders';
const CURRENT_USER_KEY = 'canteen_current_user';

// Initial menu items
const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Veggie Burger',
    description: 'Delicious plant-based patty with lettuce, tomato, and special sauce',
    price: 120,
    category: 'Main',
    available: true
  },
  {
    id: 2,
    name: 'Cheese Pizza Slice',
    description: 'Freshly baked pizza with mozzarella cheese and tomato sauce',
    price: 80,
    category: 'Main',
    available: true
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with creamy dressing, croutons, and parmesan',
    price: 100,
    category: 'Sides',
    available: true
  },
  {
    id: 4,
    name: 'French Fries',
    description: 'Golden crispy fries seasoned with salt',
    price: 60,
    category: 'Sides',
    available: true
  },
  {
    id: 5,
    name: 'Chocolate Brownie',
    description: 'Rich, fudgy brownie with chocolate chips',
    price: 50,
    category: 'Desserts',
    available: true
  },
  {
    id: 6,
    name: 'Iced Coffee',
    description: 'Cold brewed coffee served over ice',
    price: 70,
    category: 'Beverages',
    available: true
  },
  {
    id: 7,
    name: 'Chicken Sandwich',
    description: 'Grilled chicken breast with lettuce, tomato, and mayo',
    price: 130,
    category: 'Main',
    available: true
  },
  {
    id: 8,
    name: 'Fruit Smoothie',
    description: 'Blend of fresh berries, banana, and yogurt',
    price: 90,
    category: 'Beverages',
    available: true
  }
];

// Initialize database
const initializeDatabase = () => {
  // Initialize menu items if they don't exist
  if (!localStorage.getItem(MENU_ITEMS_KEY)) {
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(initialMenuItems));
  }
  
  // Initialize orders if they don't exist
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
};

// Menu items operations
export const getMenuItems = (): MenuItem[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(MENU_ITEMS_KEY) || '[]');
};

export const updateMenuItem = (item: MenuItem): void => {
  const menuItems = getMenuItems();
  const index = menuItems.findIndex(i => i.id === item.id);
  
  if (index !== -1) {
    menuItems[index] = item;
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(menuItems));
  }
};

export const addMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
  const menuItems = getMenuItems();
  const newId = menuItems.length > 0 
    ? Math.max(...menuItems.map(item => item.id)) + 1 
    : 1;
  
  const newItem = { ...item, id: newId };
  menuItems.push(newItem);
  localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(menuItems));
  
  return newItem;
};

// Orders operations
export const getOrders = (): Order[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
};

export const getOrderById = (id: number): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === id);
};

export const addOrder = (order: Omit<Order, 'id' | 'timestamp'>): Order => {
  const orders = getOrders();
  const newId = orders.length > 0 
    ? Math.max(...orders.map(order => order.id)) + 1 
    : 1;
  
  const newOrder = { 
    ...order, 
    id: newId,
    timestamp: Date.now()
  };
  
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  return newOrder;
};

export const updateOrderStatus = (id: number, status: OrderStatus): Order | undefined => {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === id);
  
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return orders[index];
  }
  
  return undefined;
};

// User operations
export const setCurrentUser = (userId: string, isAdmin: boolean): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: userId, isAdmin }));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};