
import { Routes, Route, useLocation } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";


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

  return (
    <>
      {isAdminRoute ? (
 ADMIN]-dashboard
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<BooksManager />} />
          </Route>
        </Routes>
      ) : (

        // Admin Layout
        <div className="wrapper">
          <Navbar />
          <Sidebar />
          <div className="content-wrapper">
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </div>
      ) : (
        // User Layout
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
    </>
  );
}

export default App;
