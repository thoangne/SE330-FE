import React from "react";
import { Carousel } from "react-bootstrap";

function BannerCarousel() {
  return (
    <Carousel
      fade
      className="rounded-2 shadow overflow-hidden"
      interval={3000}
      style={{ margin: 16 }}
    >
      <Carousel.Item fade>
        <img
          className="d-block w-100"
          src="/src/assets/banner/banner1.png"
          alt="Banner 1"
          style={{ objectFit: "cover", height: "300px" }}
        />
      </Carousel.Item>
      <Carousel.Item fade>
        <img
          className="d-block w-100"
          src="/src/assets/banner/banner2.png"
          alt="Banner 2"
          style={{ objectFit: "cover", height: "300px" }}
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default BannerCarousel;
