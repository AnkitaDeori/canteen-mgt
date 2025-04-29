import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import NavBar from './components/NavBar';

// Student Pages
import Login from './pages/student/Login';
import Menu from './pages/student/Menu';
import Checkout from './pages/student/Checkout';
import Confirmation from './pages/student/Confirmation';
import OrderStatus from './pages/student/OrderStatus';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';

// Protected route component
const ProtectedRoute: React.FC<{ 
  element: React.ReactNode; 
  requireAdmin?: boolean;
}> = ({ element, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/menu" replace />;
  }
  
  return <>{element}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Student routes */}
      <Route path="/menu" element={<ProtectedRoute element={<Menu />} />} />
      <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
      <Route path="/confirmation/:orderId" element={<ProtectedRoute element={<Confirmation />} />} />
      <Route path="/orders" element={<ProtectedRoute element={<OrderStatus />} />} />
      
      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard />} requireAdmin={true} />} />
      <Route path="/admin/menu" element={<ProtectedRoute element={<MenuManagement />} requireAdmin={true} />} />
      
      {/* Default routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function AppLayout() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {isAuthenticated && <NavBar />}
      <main className="flex-1">
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <AppLayout />
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;