import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../db/database';
import { Order } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import StatusTracker from '../../components/StatusTracker';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';

const OrderStatus: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      const allOrders = getOrders();
      const userOrders = allOrders.filter(order => order.studentId === user.id);
      setOrders(userOrders.sort((a, b) => b.timestamp - a.timestamp));
    }
  }, [user]);
  
  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
          <ShoppingBag className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
        <Link 
          to="/menu"
          className="btn btn-primary"
        >
          Browse Menu
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Order #{order.id}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(order.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`badge mr-3 ${
                  order.status === 'pending' ? 'badge-pending' :
                  order.status === 'preparing' ? 'badge-preparing' :
                  'badge-ready'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <Link 
                  to={`/confirmation/${order.id}`}
                  className="p-2 rounded-md text-amber-600 hover:bg-amber-50"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div className="mb-6">
              <StatusTracker status={order.status} />
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Items</span>
                <span className="text-gray-600">{order.items.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-amber-600">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatus;