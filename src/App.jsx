import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home/Home";
import LoginRegisterForm from "./pages/User/Authentication/LoginRegisterForm";

import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import NotFound from "./pages/NotFound/NotFound";

// Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Layout
import AdminLayout from "./components/AdminLayout";
import BooksManager from "./pages/Admin/BooksManager/BooksManager";
import UsersManager from "./pages/Admin/UsersManger/UsersManager";

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
             <Route path="*" element={<NotFound />} />
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
                 <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
