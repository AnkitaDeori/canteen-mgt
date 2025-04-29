import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../../db/database';
import { MenuItem } from '../../types';
import { useOrder } from '../../contexts/OrderContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal } = useOrder();
  
  useEffect(() => {
    const items = getMenuItems();
    setMenuItems(items);
    
    // Set the initial active category
    if (items.length > 0) {
      const categories = ['All', ...new Set(items.map(item => item.category))];
      setActiveCategory(categories[0]);
    }
  }, []);
  
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);
  
  const getItemQuantityInCart = (menuItemId: number): number => {
    const cartItem = cart.find(item => item.menuItemId === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Our Menu</h1>
        
        {cart.length > 0 && (
          <Link 
            to="/checkout" 
            className="btn btn-primary flex items-center"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span>Checkout (₹{cartTotal.toFixed(2)})</span>
          </Link>
        )}
      </div>
      
      {/* Category tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${activeCategory === category 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-amber-50'
                }
              `}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="card">
            <div className="p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                <span className="text-amber-600 font-semibold">₹{item.price.toFixed(2)}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
              
              {item.available ? (
                getItemQuantityInCart(item.id) > 0 ? (
                  <div className="flex items-center">
                    <button 
                      className="btn p-2 bg-amber-100 text-amber-600 hover:bg-amber-200"
                      onClick={() => updateQuantity(item.id, getItemQuantityInCart(item.id) - 1)}
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="mx-3 font-medium">{getItemQuantityInCart(item.id)}</span>
                    <button 
                      className="btn p-2 bg-amber-500 text-white hover:bg-amber-600"
                      onClick={() => addToCart(item, 1)}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary w-full"
                    onClick={() => addToCart(item, 1)}
                  >
                    Add to Order
                  </button>
                )
              ) : (
                <button 
                  className="btn w-full bg-gray-200 text-gray-500 cursor-not-allowed"
                  disabled
                >
                  Unavailable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;