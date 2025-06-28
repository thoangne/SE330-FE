import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { RequireAuth, RequireUnauth } from "./components/Auth/AuthGuard";
import { RequireAdmin } from "./components/Auth/RequireAdmin";
import { AuthProvider } from "./components/Auth/AuthProvider";
import AuthErrorBoundary from "./components/Auth/AuthErrorBoundary";
// Pages
import Home from "./pages/Home/Home";
import LoginRegisterForm from "./pages/User/Authentication/LoginRegisterForm";
import Profile from "./pages/User/Profile/Profile";
import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import DetailSearch from "./pages/Home/components/DetailSearch/DetailSearch";
import AllProducts from "./pages/Home/components/AllProducts/AllProducts";

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

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <AuthErrorBoundary>
      <AuthProvider>
        {isAdminRoute ? (
          // <RequireAdmin>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="books" element={<BooksManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="authors" element={<AuthorManager />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        ) : (
          // </RequireAdmin>
          <>
            <Header />
            <main style={{ minHeight: "80vh" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/login"
                  element={
                    <RequireUnauth>
                      <LoginRegisterForm />
                    </RequireUnauth>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <CheckoutPage />
                    </RequireAuth>
                  }
                />
                <Route path="/search" element={<DetailSearch />} />
                <Route path="/products/:type" element={<AllProducts />} />
                <Route path="/category/:categoryId" element={<AllProducts />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </AuthErrorBoundary>
  );
}

export default App;
