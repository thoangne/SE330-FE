// Mock data for books
export const mockBooks = [
  {
    id: 1,
    name: "Clean Code - Mã Sạch Và Con Đường Trở Thành Lập Trình Viên Giỏi",
    price: 250000,
    image: "https://picsum.photos/200/300?random=1",
    description: "Cuốn sách kinh điển về lập trình sạch",
    categoryId: 6, // Lập trình
    publisherId: 4, // NXB Dân Trí
    publishDate: "2025-01-15",
    discount: 20,
    author: "Robert C. Martin",
  },
  {
    id: 2,
    name: "Design Patterns - Các Mẫu Thiết Kế Cơ Bản",
    price: 300000,
    image: "https://picsum.photos/200/300?random=2",
    description: "Sách về các mẫu thiết kế phần mềm",
    categoryId: 6, // Lập trình
    publisherId: 1, // NXB Trẻ
    publishDate: "2025-02-20",
    discount: 10,
    author: "Erich Gamma",
  },
  {
    id: 3,
    name: "Đắc Nhân Tâm",
    price: 150000,
    image: "https://picsum.photos/200/300?random=3",
    description: "Nghệ thuật thu phục lòng người",
    categoryId: 4, // Kỹ năng sống
    publisherId: 1, // NXB Trẻ
    publishDate: "2025-03-10",
    discount: 15,
    author: "Dale Carnegie",
  },
  {
    id: 4,
    name: "Nhà Giả Kim",
    price: 180000,
    image: "https://picsum.photos/200/300?random=4",
    description: "Cuốn sách về hành trình khám phá bản thân",
    categoryId: 2, // Văn học
    publisherId: 5, // NXB Văn học
    publishDate: "2025-04-05",
    discount: 0,
    author: "Paulo Coelho",
  },
  {
    id: 5,
    name: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    price: 120000,
    image: "https://picsum.photos/200/300?random=5",
    description: "Câu chuyện về tuổi thơ đẹp đẽ",
    categoryId: 5, // Thiếu nhi
    publisherId: 1, // NXB Trẻ
    publishDate: "2025-05-15",
    discount: 5,
    author: "Nguyễn Nhật Ánh",
  },
  {
    id: 6,
    name: "Yêu Trong Tĩnh Lặng",
    price: 160000,
    image: "https://picsum.photos/200/300?random=6",
    description: "Chuyện tình lãng mạn và sâu lắng",
    categoryId: 1, // Ngôn tình
    publisherId: 5, // NXB Văn học
    publishDate: "2025-06-20",
    discount: 0,
    author: "Minh Nguyệt",
  },
  {
    id: 7,
    name: "Python cho người mới bắt đầu",
    price: 280000,
    image: "https://picsum.photos/200/300?random=7",
    description: "Hướng dẫn Python từ cơ bản đến nâng cao",
    categoryId: 6, // Lập trình
    publisherId: 4, // NXB Dân Trí
    publishDate: "2025-07-10",
    discount: 25,
    author: "John Smith",
  },
  {
    id: 8,
    name: "Kinh Tế Học Hài Hước",
    price: 200000,
    image: "https://picsum.photos/200/300?random=8",
    description: "Khám phá kinh tế học qua những câu chuyện vui",
    categoryId: 3, // Kinh tế
    publisherId: 1, // NXB Trẻ
    publishDate: "2025-08-05",
    discount: 30,
    author: "Steven D. Levitt",
  },
];

// Generate more books for testing pagination
const generateMoreBooks = () => {
  const moreBooks = [];
  const categories = [
    "Lập trình",
    "Văn học",
    "Kỹ năng sống",
    "Kinh tế",
    "Thiếu nhi",
    "Ngoại ngữ",
  ];
  const publishers = [
    "NXB Trẻ",
    "NXB Dân Trí",
    "NXB Văn học",
    "NXB Khoa học Kỹ thuật",
    "NXB Tổng hợp",
  ];

  for (let i = 9; i <= 100; i++) {
    moreBooks.push({
      id: i,
      name: `Sách mẫu ${i} - Tiêu đề dài để test việc hiển thị nhiều dòng trong card sản phẩm`,
      price: Math.floor(Math.random() * 400000) + 100000,
      image: `https://picsum.photos/200/300?random=${i}`,
      description: `Mô tả cho sách mẫu ${i}`,
      categoryId: Math.floor(Math.random() * 6) + 1,
      publisherId: Math.floor(Math.random() * 5) + 1,
      publishDate: new Date(
        2024 + Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      discount: Math.random() < 0.3 ? Math.floor(Math.random() * 30) + 5 : 0,
      author: `Tác giả ${i}`,
    });
  }
  return moreBooks;
};

// Combine base books with generated books
export const allBooks = [...mockBooks, ...generateMoreBooks()];
