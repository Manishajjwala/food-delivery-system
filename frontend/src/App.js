import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetail from './pages/OrderDetail';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RiderHome from './pages/RiderHome';
import RiderEarnings from './pages/RiderEarnings';
import RiderProfile from './pages/RiderProfile';

// New Content Pages
import { Careers, Blog, Partner, FAQ, Refunds, Terms, Privacy } from './pages/ContentPages';
import RestaurantOnboarding from './pages/RestaurantOnboarding';
import TrackOrder from './pages/TrackOrder';


// Layout wrapper — hides Navbar/Footer on admin/delivery pages
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isRiderPage = location.pathname.startsWith('/rider');
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      {!isAdminPage && !isRiderPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminPage && !isRiderPage && <Footer />}
    </div>
  );
};



function App() {
  return (
    <Router>
      <CartProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />

        {/* Delivery Partner (Rider) Routes */}
        <Route path="/rider" element={<RiderHome />} />
        <Route path="/rider/earnings" element={<RiderEarnings />} />
        <Route path="/rider/profile" element={<RiderProfile />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminLogin />} />



            {/* Footer Information Routes */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/partner-onboarding" element={<RestaurantOnboarding />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </CartProvider>
    </Router>
  );
}

export default App;
