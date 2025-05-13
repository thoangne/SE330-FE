import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import LoginRegisterForm from "./pages/User/Authentication/LoginRegisterForm";
import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";

/* // Import các page mới
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";

import ProfilePage from "./pages/user/ProfilePage";
import OrderPage from "./pages/user/OrderPage";
import FavoritePage from "./pages/user/FavoritePage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";
import RevenueReport from "./pages/admin/RevenueReport";
import EventManagement from "./pages/admin/EventManagement";
import RulesetManagement from "./pages/admin/RulesetManagement"; */

function Router() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      {/*       <Route path="/category/:categorySlug" element={<CategoryPage />} />
      <Route path="/product/:productSlug" element={<ProductDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} /> */}

      {/* Auth Routes */}
      <Route path="/login" element={<LoginRegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* User Routes */}
      {/*      <Route path="/user/profile" element={<ProfilePage />} />
      <Route path="/user/orders" element={<OrderPage />} />
      <Route path="/user/favorites" element={<FavoritePage />} /> */}

      {/* Admin Routes */}
      {/*  <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<ProductManagement />} />
      <Route path="/admin/orders" element={<OrderManagement />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/revenue" element={<RevenueReport />} />
      <Route path="/admin/events" element={<EventManagement />} />
      <Route path="/admin/rulesets" element={<RulesetManagement />} /> */}

      {/* 404 Not Found (nếu muốn thêm) */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default Router;
