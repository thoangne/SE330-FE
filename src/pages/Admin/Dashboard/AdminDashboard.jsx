
import { Container, Row, Col } from "react-bootstrap";
import Stats from "./components/Stats";
import GraphOnlineUsers from "./components/GraphOnlineUsers";

const AdminDashboard = () => {
  return (
    <>
      <Stats />
      <GraphOnlineUsers />
    </>

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
