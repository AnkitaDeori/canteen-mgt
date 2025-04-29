import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MenuIcon, ShoppingBag, User } from 'lucide-react';

const NavBar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-amber-500" />
              <span className="ml-2 text-xl font-bold text-amber-800">Campus Canteen</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link 
                      to="/menu" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/menu' ? 'text-amber-600 bg-amber-50' : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'}`}
                    >
                      Menu
                    </Link>
                    <Link 
                      to="/orders" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/orders' ? 'text-amber-600 bg-amber-50' : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'}`}
                    >
                      My Orders
                    </Link>
                  </>
                )}
                
                {isAdmin && (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin/dashboard' ? 'text-amber-600 bg-amber-50' : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'}`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/menu" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin/menu' ? 'text-amber-600 bg-amber-50' : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'}`}
                    >
                      Manage Menu
                    </Link>
                  </>
                )}
                
                <button 
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50"
                >
                  Logout
                </button>
                <div className="flex items-center bg-amber-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-amber-800" />
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;