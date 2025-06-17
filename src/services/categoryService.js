// Mock categories data
const categories = [
  {
    id: 1,
    name: "Ngôn tình",
    description:
      "Tiểu thuyết lãng mạn là một thuật ngữ để mô tả dòng văn xuôi (hoặc đôi khi văn vần) khai thác mối quan hệ tình cảm, tình dục giữa người với người, luôn hướng độc giả đến sự rung cảm chân thành nhất. Tiểu thuyết lãng mạn của Trung Quốc thường được gọi là ngôn tình.",
  },
  {
    id: 2,
    name: "Văn học",
    description:
      "Văn học là các tác phẩm được viết hoặc kể lại có giá trị nghệ thuật, phản ánh hiện thực cuộc sống thông qua hình tượng nghệ thuật bằng ngôn ngữ.",
  },
  {
    id: 3,
    name: "Kinh tế",
    description:
      "Sách kinh tế bao gồm các tài liệu về quản trị kinh doanh, tài chính, marketing, và các lĩnh vực liên quan đến kinh tế.",
  },
  {
    id: 4,
    name: "Kỹ năng sống",
    description:
      "Sách kỹ năng sống giúp người đọc phát triển các kỹ năng cần thiết trong cuộc sống như giao tiếp, quản lý thời gian, tư duy tích cực.",
  },
  {
    id: 5,
    name: "Thiếu nhi",
    description:
      "Sách dành cho độc giả nhỏ tuổi, bao gồm truyện tranh, truyện cổ tích, và sách giáo dục.",
  },
  {
    id: 6,
    name: "Lập trình",
    description:
      "Sách về công nghệ thông tin, lập trình, và phát triển phần mềm.",
  },
];

export const getAllCategories = () => {
  return Promise.resolve(categories);
};

export const getCategoryById = (id) => {
  const category = categories.find((cat) => cat.id === id);
  return Promise.resolve(category);
};
