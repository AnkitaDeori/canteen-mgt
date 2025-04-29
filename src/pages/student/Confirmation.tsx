import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import StatusTracker from '../../components/StatusTracker';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const Confirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentOrder, setCurrentOrder } = useOrder();
  
  useEffect(() => {
    if (orderId) {
      setCurrentOrder(parseInt(orderId, 10));
    }
    
    return () => {
      setCurrentOrder(null);
    };
  }, [orderId, setCurrentOrder]);
  
  if (!currentOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
        <Link 
          to="/menu"
          className="btn btn-primary inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Browse Menu
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link 
        to="/menu"
        className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6"
      >
        <ArrowLeft className="mr-1 h-5 w-5" />
        Back to Menu
      </Link>
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Order Confirmed!</h1>
        <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
      </div>
      
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-800">Order #{currentOrder.id}</h2>
            <p className="text-sm text-gray-600">
              {new Date(currentOrder.timestamp).toLocaleString()}
            </p>
          </div>
          <div>
            <span className={`badge ${
              currentOrder.status === 'pending' ? 'badge-pending' :
              currentOrder.status === 'preparing' ? 'badge-preparing' :
              'badge-ready'
            }`}>
              {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <StatusTracker status={currentOrder.status} />
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-2">Order Details</h3>
          <div className="divide-y">
            {currentOrder.items.map((item, index) => (
              <div key={index} className="py-3 flex justify-between">
                <div>
                  <span className="font-medium">{item.quantity}x </span>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t flex justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold text-amber-600">₹{currentOrder.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <h3 className="font-medium text-amber-800 mb-2">Pickup Information</h3>
        <p className="text-amber-700 mb-4">
          Show your Order ID to pick up your order at the counter.
        </p>
        <div className="bg-white p-4 rounded border border-amber-200 text-center">
          <span className="text-3xl font-bold text-amber-800">#{currentOrder.id}</span>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;