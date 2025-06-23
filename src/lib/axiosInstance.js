import axios from "axios";

const axiosInstance = axios.create({
  baseURL: " https://quanlynhasach-be.onrender.com/api",
});

export default axiosInstance;
