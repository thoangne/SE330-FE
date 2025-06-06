import React from "react";
import CategoryBar from "./components/CategoryBar/CategoryBar";
import BannerCarousel from "./components/BannerCarousel/BannerCarousel";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import { Container } from "react-bootstrap";

function Home() {
  return (
    <>
      
        <CategoryBar />
      <BannerCarousel />
      <Container className="mt-4">
        <ProductGrid />
        <ProductGrid />
        <ProductGrid />
      </Container>
    </>
  );
}

export default Home;
