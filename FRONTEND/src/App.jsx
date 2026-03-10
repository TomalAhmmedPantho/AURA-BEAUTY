import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// --- ROUTE GUARDS ---

/**
 * Gatekeeper for Admin routes.
 * Redirects anyone who is not an admin to the Home page.
 */
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen text-pink-600">Loading Admin Access...</div>;
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

/**
 * Gatekeeper for Customer-only routes (Cart, My Orders).
 * 1. If not logged in -> Redirect to Login.
 * 2. If Admin -> Redirect to Admin Dashboard (Admins don't shop).
 */
const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

// --- MAIN APP COMPONENT ---

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#fafafa]">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* 1. Public Routes: Accessible by Everyone */}
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 2. Customer Routes: Restricted to logged-in non-admins */}
                <Route 
                  path="/cart" 
                  element={
                    <CustomerRoute>
                      <CartPage />
                    </CustomerRoute>
                  } 
                />
                <Route 
                  path="/my-orders" 
                  element={
                    <CustomerRoute>
                      <MyOrdersPage />
                    </CustomerRoute>
                  } 
                />

                {/* 3. Admin Routes: Restricted to Admin accounts only */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  } 
                />

                {/* 4. Catch-all: Redirect unknown paths to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}