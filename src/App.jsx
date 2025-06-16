import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Pages
import Home from "./pages/Home/Home";
import LoginRegisterForm from "./pages/User/Authentication/LoginRegisterForm";
import Profile from "./pages/User/Profile/Profile";

import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";

// Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Layout
import AdminLayout from "./components/AdminLayout";
import BooksManager from "./pages/Admin/BooksManager/BooksManager";
import UsersManager from "./pages/Admin/UsersManger/UsersManager";
import AuthorManager from "./pages/Admin/Author/AuthorManager";
import OrdersManager from "./pages/Admin/Order/OrdersManager";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ProductDetail from "./pages/Home/components/ProductDetail/ProductDetail";
import CartPage from "./pages/Home/components/CartPage/CartPage";
import CheckoutPage from "./pages/Home/components/CheckoutPage/CheckoutPage";
import SearchResult from "./pages/Home/components/SearchResult/SearchResult";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<BooksManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="authors" element={<AuthorManager />} />
            <Route path="orders" element={<OrdersManager />} />
            {/* Trang 404 */}

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      ) : (
        // User Layout
        <>
          <Header />
          <main style={{ minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginRegisterForm />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/search/:keyword" element={<SearchResult />} />
              <Route path="/profile" element={<Profile />} />
              {/* Trang 404 */}

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
      <Toaster position="top-right" reverseOrder={false} />
      {/* Trang 404 */}
    </>
  );
}

export default App;
