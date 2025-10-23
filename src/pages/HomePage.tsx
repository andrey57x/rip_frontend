import React from "react";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import ProjectCarousel from "../components/carousel/Carousel"; // 1. Импортируем новый компонент
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <main className="home-page">
      <Breadcrumbs items={[{ title: "Главная", to: "/" }]} />

      <ProjectCarousel />

    </main>
  );
};

export default HomePage;