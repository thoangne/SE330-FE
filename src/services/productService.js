// Importing mock books data
import { allBooks } from "./mockBooks";

// Get a single book by ID
export const getProductById = (id) => {
  // Simulating API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = allBooks.find((book) => book.id === Number(id));
      if (product) {
        // Add additional details for product page
        const enrichedProduct = {
          ...product,
          specifications: {
            dimensions: "20.5 x 13 x 1.2 cm",
            weight: "350 gram",
            pages: Math.floor(Math.random() * 300) + 100,
            format: "Bìa mềm",
            publisher: "NXB Trẻ",
            publicationYear: "2025",
            language: "Tiếng Việt",
          },
          stock: Math.floor(Math.random() * 50) + 1,
          description: product.description || "Đang cập nhật...",
          longDescription: `${product.name} là một trong những cuốn sách bán chạy nhất của tác giả ${product.author}. 
            Cuốn sách mang đến cho độc giả cái nhìn sâu sắc về chủ đề được đề cập, 
            với lối viết cuốn hút và nội dung phong phú.
            
            Điểm nổi bật của cuốn sách:
            - Nội dung chất lượng, được chọn lọc kỹ càng
            - Hình thức trình bày đẹp mắt, khoa học
            - Giá trị thực tiễn cao
            - Phù hợp với nhiều độc giả
            
            Đây là cuốn sách không thể thiếu trong tủ sách của bạn!`,
          relatedProducts: allBooks
            .filter(
              (book) =>
                book.categoryId === product.categoryId && book.id !== product.id
            )
            .slice(0, 4),
          reviews: [
            {
              id: 1,
              userId: 1,
              userName: "Nguyễn Văn A",
              rating: 5,
              comment: "Sách rất hay, đóng gói cẩn thận!",
              date: "2025-06-15",
            },
            {
              id: 2,
              userId: 2,
              userName: "Trần Thị B",
              rating: 4,
              comment: "Nội dung chất lượng, giao hàng nhanh.",
              date: "2025-06-14",
            },
            {
              id: 3,
              userId: 3,
              userName: "Lê Văn C",
              rating: 5,
              comment: "Tuyệt vời, sẽ ủng hộ shop dài dài.",
              date: "2025-06-13",
            },
          ],
          rating: {
            average: 4.5,
            count: 28,
            detail: {
              5: 20,
              4: 5,
              3: 2,
              2: 1,
              1: 0,
            },
          },
        };
        resolve(enrichedProduct);
      } else {
        reject(new Error("Product not found"));
      }
    }, 500); // 500ms delay to simulate network request
  });
};

// Get related products
export const getRelatedProducts = (categoryId, currentProductId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const relatedProducts = allBooks
        .filter(
          (book) =>
            book.categoryId === categoryId && book.id !== currentProductId
        )
        .slice(0, 4);
      resolve(relatedProducts);
    }, 300);
  });
};

// Get product reviews
export const getProductReviews = (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock reviews data
      const reviews = [
        {
          id: 1,
          productId: productId,
          userId: 1,
          userName: "Nguyễn Văn A",
          rating: 5,
          comment: "Sách rất hay, đóng gói cẩn thận!",
          date: "2025-06-15",
        },
        {
          id: 2,
          productId: productId,
          userId: 2,
          userName: "Trần Thị B",
          rating: 4,
          comment: "Nội dung chất lượng, giao hàng nhanh.",
          date: "2025-06-14",
        },
        {
          id: 3,
          productId: productId,
          userId: 3,
          userName: "Lê Văn C",
          rating: 5,
          comment: "Tuyệt vời, sẽ ủng hộ shop dài dài.",
          date: "2025-06-13",
        },
      ];
      resolve(reviews);
    }, 300);
  });
};

// Add a new review
export const addProductReview = (productId, reviewData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        productId,
        ...reviewData,
        date: new Date().toISOString().split("T")[0],
      };
      resolve(newReview);
    }, 300);
  });
};
