// Mock publishers data
const publishers = [
  {
    id: 1,
    name: "NXB Trẻ",
    address: "161B Lý Chính Thắng, Phường 7, Quận 3, TP.HCM",
    contact: "028 3931 6289",
  },
  {
    id: 2,
    name: "NXB Kim Đồng",
    address: "55 Quang Trung, Hai Bà Trưng, Hà Nội",
    contact: "024 3943 4730",
  },
  {
    id: 3,
    name: "NXB Thiếu Nhi",
    address: "Thủ Đức, TP.HCM",
    contact: "0975757576",
  },
  {
    id: 4,
    name: "NXB Dân Trí",
    address: "147 Pasteur, Quận 3, TP.HCM",
    contact: "028 3824 7225",
  },
  {
    id: 5,
    name: "NXB Văn Học",
    address: "18 Nguyễn Trường Tộ, Ba Đình, Hà Nội",
    contact: "024 3848 1468",
  },
];

export const getAllPublishers = () => {
  return Promise.resolve(publishers);
};

export const getPublisherById = (id) => {
  const publisher = publishers.find((pub) => pub.id === id);
  return Promise.resolve(publisher);
};
