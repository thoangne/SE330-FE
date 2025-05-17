// TopNavbar.js
import TopNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/Maincontent";

const AdminDashboard = () => {
  return (
    <div className="wrapper">
      <TopNavbar />
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default AdminDashboard;
