import React from "react";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowUp, FaSquare } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const GraphOnlineUsers = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "This Week",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Last Week",
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: "#6c757d",
        backgroundColor: "rgba(108, 117, 125, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };

  return (
    <Container fluid className="p-0 mt-3">
      <Card className="border-0 shadow-sm">
        <Card.Header className="border-0 bg-transparent">
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title as="h3" className="mb-0">
              Online Store Visitors
            </Card.Title>
            <Link to="/admin/reports" className="text-decoration-none">
              View Report
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <span className="fw-bold fs-3">820</span>
              <span className="text-muted">Visitors Over Time</span>
            </div>
            <div className="d-flex flex-column text-end">
              <span className="text-success">
                <FaArrowUp className="me-1" /> 12.5%
              </span>
              <span className="text-muted">Since last week</span>
            </div>
          </div>

          <div className="position-relative my-4" style={{ height: "200px" }}>
            <Line data={data} options={options} />
          </div>

          <div className="d-flex justify-content-end gap-3">
            <span className="d-flex align-items-center gap-1">
              <FaSquare className="text-primary" /> This Week
            </span>
            <span className="d-flex align-items-center gap-1">
              <FaSquare className="text-secondary" /> Last Week
            </span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GraphOnlineUsers;
