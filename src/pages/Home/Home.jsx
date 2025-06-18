import React from "react";
import CategoryBar from "./components/CategoryBar/CategoryBar";
import BannerCarousel from "./components/BannerCarousel/BannerCarousel";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import { Container } from "react-bootstrap";
import "./Home.css";
import { bookService } from "../../services/bookService";
import {
  FaArrowTrendUp,
  FaPercent,
  FaShuffle,
  FaBookOpen,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-wrapper">
      {/* <Container>
        <CategoryBar />
      </Container> */}
      <Container>
        <BannerCarousel />
      </Container>
      <Container className="mt-4">
        <div className="product-section">
          <ProductGrid
            title="Sản phẩm nổi bật"
            icon={FaArrowTrendUp}
            fetchBooks={bookService.getFeaturedBooks}
            type="featured"
            className="mb-4"
          />
          {/* <div className="text-center">
            <Link to="/products/featured" className="btn btn-outline-primary">
              Xem tất cả sản phẩm nổi bật
            </Link>
          </div> */}
        </div>

        <div className="product-section">
          <ProductGrid
            title="Giảm giá sốc"
            icon={FaPercent}
            fetchBooks={bookService.getBestDiscountBooks}
            type="discount"
            className="mb-4"
          />
          {/* <div className="text-center">
            <Link to="/products/discount" className="btn btn-outline-primary">
              Xem tất cả sản phẩm giảm giá
            </Link>
          </div> */}
        </div>

        <div className="product-section">
          <ProductGrid
            title="Sách mới"
            icon={FaBookOpen}
            fetchBooks={bookService.getNewBooks}
            type="new"
            className="mb-4"
          />
          {/* <div className="text-center">
            <Link to="/products/new" className="btn btn-outline-primary">
              Xem tất cả sách mới
            </Link>
          </div> */}
        </div>

        <div className="product-section">
          <ProductGrid
            title="Gợi ý hôm nay"
            icon={FaShuffle}
            fetchBooks={bookService.getDailyBooks}
            type="daily"
            className="mb-4"
          />
          {/* <div className="text-center">
            <Link to="/products/daily" className="btn btn-outline-primary">
              Xem tất cả gợi ý
            </Link>
          </div> */}
        </div>
      </Container>
    </div>
  );
}

export default Home;
