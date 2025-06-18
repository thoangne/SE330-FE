import React from "react";
import { Row, Col } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Carousel from "react-bootstrap/Carousel";
import "./BannerCarousel.css";

// Import banner images
import banner1 from "../../../../assets/banner/banner1.png";
import banner2 from "../../../../assets/banner/banner2.png";

const mainBanners = [
  {
    id: 1,
    image: banner1,
    alt: "Banner 1",
  },
  {
    id: 2,
    image: banner2,
    alt: "Banner 2",
  },
];

function BannerCarousel() {
  const CustomPrevIcon = (
    <span className="carousel-control-prev-icon custom-icon">
      <FaChevronLeft />
    </span>
  );

  const CustomNextIcon = (
    <span className="carousel-control-next-icon custom-icon">
      <FaChevronRight />
    </span>
  );

  return (
    <Row className="banner-section g-2 g-md-3">
      <Col lg={9} md={8}>
        <Carousel
          fade
          interval={3000}
          prevIcon={CustomPrevIcon}
          nextIcon={CustomNextIcon}
          indicators={true}
          className="main-carousel h-100"
        >
          {mainBanners.map((banner) => (
            <Carousel.Item key={banner.id}>
              <img
                className="d-block w-100 banner-img"
                src={banner.image}
                alt={banner.alt}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Col>

      <Col lg={3} md={4}>
        <div className="d-flex flex-column h-100 gap-2 gap-md-3">
          <div className="side-banner h-50">
            <img src={banner1} alt="Side banner 1" className="w-100 h-100" />
          </div>
          <div className="side-banner h-50">
            <img src={banner2} alt="Side banner 2" className="w-100 h-100" />
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default BannerCarousel;
