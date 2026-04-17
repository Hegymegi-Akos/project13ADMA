import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';

import Home from './components/Home';
import CategoryPage from './components/CategoryPage';

import Auth from './components/Auth';
import ForgotPassword from './components/ForgotPassword';
import Cart from './components/Cart';
import Orders from './components/Orders';
import MyCoupons from './components/MyCoupons';
import Favorites from './components/Favorites';

import About from './components/About';
import Search from './components/Search';
import Gallery from './components/Gallery';
import Wall from './components/Wall';
import Tips from './components/Tips';
import Contact from './components/Contact';
import Messages from './components/Messages';

import ProductCategory from './components/ProductCategory';
import ProductDetail from './components/ProductDetail';
import DynamicSubcategory from './components/DynamicSubcategory';

import Header from './components/Header';
import Footer from './components/Footer';

import AdminLayout from './components/AdminLayout';
import Admin from './components/Admin';
import AdminProducts from './components/AdminProducts';
import AdminUsers from './components/AdminUsers';
import AdminCoupons from './components/AdminCoupons';
import AdminOrders from './components/AdminOrders';
import AdminCategories from './components/AdminCategories';

const ScrollTopButton = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="scroll-top"
      aria-label="Oldal tetejere"
    >
      &#8679;
    </button>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.body.classList.toggle('admin-route', isAdminRoute);
    document.body.classList.toggle('store-route', !isAdminRoute);
    return () => {
      document.body.classList.remove('admin-route');
      document.body.classList.remove('store-route');
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <div className="storefront-layout">
      <Header />
      <ScrollTopButton />
      <Routes>
        <Route path="/" element={<><p className="kezdolapu">Udvozlunk a Kisallat Webshop webaruhazban!</p><Home /></>} />
        <Route path="/dog" element={<CategoryPage type="dog" />} />
        <Route path="/cat" element={<CategoryPage type="cat" />} />
        <Route path="/reptile" element={<CategoryPage type="reptile" />} />
        <Route path="/rodent" element={<CategoryPage type="rodent" />} />
        <Route path="/bird" element={<CategoryPage type="bird" />} />
        <Route path="/fish" element={<CategoryPage type="fish" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/tips" element={<Tips />} />
        {/* Hardcoded subcategory routes */}
        <Route path="/dogfood" element={<ProductCategory type="dogfood" />} />
        <Route path="/leash" element={<ProductCategory type="leash" />} />
        <Route path="/collar" element={<ProductCategory type="collar" />} />
        <Route path="/flea" element={<ProductCategory type="flea" />} />
        <Route path="/dogbowl" element={<ProductCategory type="dogbowl" />} />
        <Route path="/dogharness" element={<ProductCategory type="dogharness" />} />
        <Route path="/catfood" element={<ProductCategory type="catfood" />} />
        <Route path="/cattoy" element={<ProductCategory type="cattoy" />} />
        <Route path="/rodentfood" element={<ProductCategory type="rodentfood" />} />
        <Route path="/rodentcage" element={<ProductCategory type="rodentcage" />} />
        <Route path="/rodentbedding" element={<ProductCategory type="rodentbedding" />} />
        <Route path="/rodenttoy" element={<ProductCategory type="rodenttoy" />} />
        <Route path="/reptilefood" element={<ProductCategory type="reptilefood" />} />
        <Route path="/terrarium" element={<ProductCategory type="terrarium" />} />
        <Route path="/reptilelamp" element={<ProductCategory type="reptilelamp" />} />
        <Route path="/birdfood" element={<ProductCategory type="birdfood" />} />
        <Route path="/birdcage" element={<ProductCategory type="birdcage" />} />
        <Route path="/birdtoy" element={<ProductCategory type="birdtoy" />} />
        <Route path="/fishfood" element={<ProductCategory type="fishfood" />} />
        <Route path="/aquarium" element={<ProductCategory type="aquarium" />} />
        <Route path="/fishfilter" element={<ProductCategory type="fishfilter" />} />
        {/* Dynamic subcategory route for newly created subcategories */}
        <Route path="/products/:category/:subcategory" element={<DynamicSubcategory />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/coupons" element={<MyCoupons />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
              <AppContent />
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;