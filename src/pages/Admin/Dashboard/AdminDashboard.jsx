import { Container, Row, Col } from "react-bootstrap";
import Stats from "./components/Stats";
import GraphOnlineUsers from "./components/GraphOnlineUsers";

const AdminDashboard = () => {
  return (
    <>
      <Stats />
      <GraphOnlineUsers />
    </>
  );
};

export default AdminDashboard;
