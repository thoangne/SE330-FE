import React from "react";
import CategoryBar from "./components/CategoryBar";
import BannerCarousel from "./components/BannerCarousel";
import ProductGrid from "./components/ProductGrid";
import { Container } from "react-bootstrap";

function Home() {
  return (
    <>
      
        <CategoryBar />
      <BannerCarousel />
      <Container className="mt-4">
        <ProductGrid />
      </Container>
    </>
  );
}

export default Home;
