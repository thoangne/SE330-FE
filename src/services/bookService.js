// Tạo danh sách tác giả để random
const authors = [
  "Dale Carnegie",
  "Paulo Coelho",
  "Robin Sharma",
  "Adam Khoo",
  "Nguyễn Nhật Ánh",
  "Tô Hoài",
  "Rosie Nguyễn",
  "Tony Buổi Sáng",
  "Nguyễn Phong Việt",
];

// Tạo danh sách tên sách để random
const bookTitles = [
  "Đắc Nhân Tâm",
  "Nhà Giả Kim",
  "Đời Ngắn Đừng Ngủ Dài",
  "Cà Phê Cùng Tony",
  "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
  "Dế Mèn Phiêu Lưu Ký",
  "Tuổi Trẻ Đáng Giá Bao Nhiêu",
  "Đừng Bao Giờ Đi Ăn Một Mình",
  "Người Giàu Có Nhất Thành Babylon",
  "Hạt Giống Tâm Hồn",
  "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
  "Mắt Biếc",
  "Totto-Chan Bên Cửa Sổ",
  "Hoàng Tử Bé",
  "Những Tấm Lòng Cao Cả",
  "Đi Tìm Lẽ Sống",
  "Bí Mật Của May Mắn",
  "Nghệ Thuật Sống",
  "Đọc Vị Bất Kỳ Ai",
  "Khéo Ăn Khéo Nói Sẽ Có Được Thiên Hạ",
];

// Generate 100 books
const generateBooks = (count) => {
  const books = [];
  for (let i = 1; i <= count; i++) {
    const randomTitle =
      bookTitles[Math.floor(Math.random() * bookTitles.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    books.push({
      id: i,
      name: `${randomTitle} - Tập ${Math.floor(i / bookTitles.length) + 1}`,
      author: randomAuthor,
      price: Math.floor(Math.random() * (200000 - 50000) + 50000),
      discount: Math.floor(Math.random() * 50),
      image: `https://picsum.photos/seed/book${i}/200/300`,
      stock: Math.floor(Math.random() * 100) + 1,
      rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
      sold: Math.floor(Math.random() * 2000),
    });
  }
  return books;
};

// Generate 100 books
const books = generateBooks(100);

// Hàm helper để shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Mock API calls with pagination
export const bookService = {
  // Lấy sách nổi bật (có rating cao và bán chạy)
  getFeaturedBooks: async (page = 1, perPage = 12) => {
    const featured = books.filter(
      (book) => book.rating >= 4.5 && book.sold >= 500
    );
    const paginatedBooks = featured.slice((page - 1) * perPage, page * perPage);
    const hasMore = paginatedBooks.length === perPage;

    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            books: paginatedBooks,
            hasMore,
          }),
        800
      )
    );
  },

  // Lấy sách giảm giá cao nhất
  getBestDiscountBooks: async (page = 1, perPage = 12) => {
    const sorted = [...books].sort((a, b) => b.discount - a.discount);
    const paginatedBooks = sorted.slice((page - 1) * perPage, page * perPage);
    const hasMore = paginatedBooks.length === perPage;

    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            books: paginatedBooks,
            hasMore,
          }),
        800
      )
    );
  },

  // Lấy sách ngẫu nhiên mỗi ngày
  getDailyBooks: async (page = 1, perPage = 12) => {
    const today = new Date().toDateString();
    const seededBooks = shuffleArray(
      [...books].sort((a, b) => (today + a.id).localeCompare(today + b.id))
    );
    const paginatedBooks = seededBooks.slice(
      (page - 1) * perPage,
      page * perPage
    );
    const hasMore = paginatedBooks.length === perPage;

    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            books: paginatedBooks,
            hasMore,
          }),
        800
      )
    );
  },

  // Lấy sách mới
  getNewBooks: async (page = 1, perPage = 12) => {
    const sorted = [...books].sort((a, b) => b.id - a.id);
    const paginatedBooks = sorted.slice((page - 1) * perPage, page * perPage);
    const hasMore = paginatedBooks.length === perPage;

    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            books: paginatedBooks,
            hasMore,
          }),
        800
      )
    );
  },
};
