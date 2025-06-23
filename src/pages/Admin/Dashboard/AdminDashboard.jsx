import { Container, Row, Col } from "react-bootstrap";
import Stats from "./components/Stats";
import GraphOnlineUsers from "./components/GraphOnlineUsers";
import useBookStore from "../../../stores/useBookStore";
import { useEffect } from "react";
import useAuthorStore from "../../../stores/useAuthorStore";
import useUserStore from "../../../stores/useUserStore";
import useOrderStore from "../../../stores/useOrderStore";

const AdminDashboard = () => {
  const { fetchBooks, books } = useBookStore();
  const { fetchAuthors, authors } = useAuthorStore();
  const { fetchUsers, users } = useUserStore();
  const { fetchOrders, orders } = useOrderStore();
  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchUsers();
    fetchOrders();
  }, [
    books,
    fetchBooks,
    fetchUsers,
    users,
    authors,
    fetchAuthors,
    orders,
    fetchOrders,
  ]);

  return (
    <>
      <Stats
        books={books.length}
        authors={authors.length}
        users={users.length}
        orders={orders.length}
      />
      <GraphOnlineUsers />
    </>
  );
};

export default AdminDashboard;
