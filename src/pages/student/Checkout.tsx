import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, placeOrder } = useOrder();
  const navigate = useNavigate();
  
  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      return;
    }
    
    const order = placeOrder();
    navigate(`/confirmation/${order.id}`);
  };
  
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Order is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your order yet.</p>
        <button 
          onClick={() => navigate('/menu')}
          className="btn btn-primary inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Browse Menu
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/menu')}
        className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6"
      >
        <ArrowLeft className="mr-1 h-5 w-5" />
        Back to Menu
      </button>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Order</h1>
      
      <div className="card mb-6">
        <div className="divide-y">
          {cart.map(item => (
            <div key={item.menuItemId} className="py-4 flex items-center">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center">
                <button 
                  className="p-1.5 rounded-md bg-amber-100 text-amber-600 hover:bg-amber-200"
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-3 font-medium">{item.quantity}</span>
                <button 
                  className="p-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="ml-6 w-20 text-right">
                <p className="font-medium text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.menuItemId)}
                className="ml-4 p-1.5 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <div className="divide-y">
          <div className="py-4 flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="py-4 flex justify-between">
            <span className="text-gray-600">GST (18%)</span>
            <span className="font-medium">₹{(cartTotal * 0.18).toFixed(2)}</span>
          </div>
          <div className="py-4 flex justify-between">
            <span className="font-medium text-gray-800">Total</span>
            <span className="font-bold text-amber-600">₹{(cartTotal * 1.18).toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          onClick={handlePlaceOrder}
          className="btn btn-primary w-full mt-6"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;