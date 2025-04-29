import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../db/database';
import { Order } from '../../types';
import { Clock, CookingPot, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready'>('pending');
  
  useEffect(() => {
    const loadOrders = () => {
      const allOrders = getOrders();
      setOrders(allOrders.sort((a, b) => b.timestamp - a.timestamp));
    };
    
    loadOrders();
    
    // Refresh orders every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const handleStatusUpdate = (orderId: number, status: 'pending' | 'preparing' | 'ready') => {
    updateOrderStatus(orderId, status);
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };
  
  const filteredOrders = orders.filter(order => order.status === activeTab);
  const counts = {
    pending: orders.filter(order => order.status === 'pending').length,
    preparing: orders.filter(order => order.status === 'preparing').length,
    ready: orders.filter(order => order.status === 'ready').length
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div 
          className={`card flex items-center cursor-pointer ${activeTab === 'pending' ? 'ring-2 ring-amber-500' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-800">Pending Orders</h3>
            <span className="text-2xl font-bold text-amber-600">{counts.pending}</span>
          </div>
        </div>
        
        <div 
          className={`card flex items-center cursor-pointer ${activeTab === 'preparing' ? 'ring-2 ring-amber-500' : ''}`}
          onClick={() => setActiveTab('preparing')}
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <CookingPot className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-800">Preparing</h3>
            <span className="text-2xl font-bold text-blue-600">{counts.preparing}</span>
          </div>
        </div>
        
        <div 
          className={`card flex items-center cursor-pointer ${activeTab === 'ready' ? 'ring-2 ring-amber-500' : ''}`}
          onClick={() => setActiveTab('ready')}
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-800">Ready for Pickup</h3>
            <span className="text-2xl font-bold text-green-600">{counts.ready}</span>
          </div>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="card py-16 text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-2">No {activeTab} orders</h2>
          <p className="text-gray-600">
            There are currently no orders in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-lg font-bold text-gray-800">Order #{order.id}</h2>
                    <span className={`ml-3 badge ${
                      order.status === 'pending' ? 'badge-pending' :
                      order.status === 'preparing' ? 'badge-preparing' :
                      'badge-ready'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Student ID: {order.studentId}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  {order.status !== 'preparing' && (
                    <button 
                      className="btn btn-outline !px-4 !py-2 flex items-center"
                      onClick={() => handleStatusUpdate(order.id, 'preparing')}
                    >
                      <CookingPot className="h-4 w-4 mr-1" />
                      Start Preparing
                    </button>
                  )}
                  
                  {order.status !== 'ready' && (
                    <button 
                      className="btn btn-primary !px-4 !py-2 flex items-center"
                      onClick={() => handleStatusUpdate(order.id, 'ready')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Ready
                    </button>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-3">Order Items</h3>
                <div className="divide-y">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-3 flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}x </span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-amber-600">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;