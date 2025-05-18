<<<<<<< Updated upstream
import Header from "./components/Header";
import Footer from "./components/Footer";
import Router from "./router";
=======
import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import LoginRegisterForm from "./pages/User/Authentication/LoginRegisterForm";
import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Layout
import AdminLayout from "./components/AdminLayout";
import BooksManager from "./pages/Admin/BooksManager/BooksManager";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
>>>>>>> Stashed changes

function App() {
  return (
    <>
<<<<<<< Updated upstream
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Router />
      </main>
      <Footer />
=======
      {isAdminRoute ? (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<BooksManager />} />
          </Route>
        </Routes>
      ) : (
        <>
          <Header />
          <main style={{ minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginRegisterForm />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
>>>>>>> Stashed changes
    </>
  );
}

export default App;
