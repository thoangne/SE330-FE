import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import LoginRegisterForm from "./pages/User/Authentication/LoginRegisterForm";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import Navbar from "./pages/Admin/Dashboard/components/Navbar";
import Sidebar from "./pages/Admin/Dashboard/components/Sidebar";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? (
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
