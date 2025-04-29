import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem, OrderItem, Order } from '../types';
import { addOrder, getOrderById } from '../db/database';
import { useAuth } from './AuthContext';

interface OrderContextType {
  cart: OrderItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  placeOrder: () => Order;
  currentOrder: Order | null;
  setCurrentOrder: (orderId: number | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentOrder, setCurrentOrderState] = useState<Order | null>(null);
  const { user } = useAuth();
  
  const addToCart = (item: MenuItem, quantity: number) => {
    // Check if the item is already in the cart
    const existingItem = cart.find(cartItem => cartItem.menuItemId === item.id);
    
    if (existingItem) {
      // Update the quantity if the item is already in the cart
      updateQuantity(item.id, existingItem.quantity + quantity);
    } else {
      // Add the new item to the cart
      setCart(prevCart => [
        ...prevCart,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity
        }
      ]);
    }
  };
  
  const removeFromCart = (menuItemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.menuItemId !== menuItemId));
  };
  
  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    
    setCart(prevCart => prevCart.map(item => 
      item.menuItemId === menuItemId ? { ...item, quantity } : item
    ));
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const placeOrder = (): Order => {
    if (!user) {
      throw new Error('User must be logged in to place an order');
    }
    
    const orderData = {
      studentId: user.id,
      items: [...cart],
      status: 'pending' as const,
      total: cartTotal
    };
    
    const newOrder = addOrder(orderData);
    setCurrentOrderState(newOrder);
    clearCart();
    
    return newOrder;
  };
  
  const setCurrentOrder = (orderId: number | null) => {
    if (orderId === null) {
      setCurrentOrderState(null);
    } else {
      const order = getOrderById(orderId);
      if (order) {
        setCurrentOrderState(order);
      }
    }
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    placeOrder,
    currentOrder,
    setCurrentOrder
  };
  
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};