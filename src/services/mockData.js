// Mock authentication data
export const MOCK_USER = {
  id: 1,
  email: "test@example.com",
  password: "password123", 
  role: "user",
  username: "thaituan",
  fullName: "Đặng Thái Tuấn",
  phone: "0859275070",
  gender: "Nam",
  birthday: "2004-09-14",
  avatar: "https://picsum.photos/100/100",
  membershipLevel: "Bạc",
  points: 0,
};

export const MOCK_TOKEN = "mock-jwt-token-12345";

export const mockUserProfile = {
  id: 1,
  username: "thaituan",
  fullName: "Đặng Thái Tuấn",
  email: "thaituan@example.com",
  phone: "0859275070",
  gender: "Nam",
  birthday: "2004-09-14",
  avatar: "https://picsum.photos/100/100",
  membershipLevel: "Bạc",
  points: 0,
};

export const mockOrders = [
  {
    id: "ORD001",
    date: "2025-06-15",
    total: 250000,
    status: "Đã giao hàng",
    items: [
      {
        id: 1,
        name: "Sách Clean Code",
        price: 250000,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD002",
    date: "2025-06-10",
    total: 480000,
    status: "Đã giao hàng",
    items: [
      {
        id: 2,
        name: "JavaScript: The Good Parts",
        price: 180000,
        quantity: 1,
      },
      {
        id: 3,
        name: "Design Patterns",
        price: 300000,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD003",
    date: "2025-06-16",
    total: 280000,
    status: "Đang xử lý",
    items: [
      {
        id: 4,
        name: "Refactoring",
        price: 280000,
        quantity: 1,
      },
    ],
  },
];

export const mockNotifications = [
  {
    id: 1,
    title: "Đơn hàng đã được xác nhận",
    message: "Đơn hàng #ORD001 của bạn đã được xác nhận",
    date: "2025-06-15",
    isRead: false,
  },
  {
    id: 2,
    title: "Khuyến mãi mới",
    message: "Giảm 20% cho tất cả sách công nghệ",
    date: "2025-06-14",
    isRead: true,
  },
  {
    id: 3,
    title: "Đơn hàng đã giao thành công",
    message: "Đơn hàng #ORD002 đã được giao thành công",
    date: "2025-06-13",
    isRead: true,
  },
];

export const mockWishlist = [
  {
    id: 1,
    name: "JavaScript: The Good Parts - Những Phần Hay Nhất Của JavaScript",
    price: 180000,
    image: "https://picsum.photos/200/300?random=1",
  },
  {
    id: 2,
    name: "Clean Code - Mã Sạch Và Con Đường Trở Thành Lập Trình Viên Giỏi",
    price: 250000,
    image: "https://picsum.photos/200/300?random=2",
  },
  {
    id: 3,
    name: "Design Patterns - Các Mẫu Thiết Kế Cơ Bản",
    price: 300000,
    image: "https://picsum.photos/200/300?random=3",
  },
  {
    id: 4,
    name: "Refactoring - Tái Cấu Trúc Mã Nguồn",
    price: 280000,
    image: "https://picsum.photos/200/300?random=4",
  },
  {
    id: 5,
    name: "Domain-Driven Design - Thiết Kế Hướng Miền",
    price: 350000,
    image: "https://picsum.photos/200/300?random=5",
  },
  {
    id: 6,
    name: "Clean Architecture",
    price: 250000,
    image: "https://picsum.photos/200/300?random=6",
  },
  {
    id: 7,
    name: "Test-Driven Development",
    price: 300000,
    image: "https://picsum.photos/200/300?random=7",
  },
];
