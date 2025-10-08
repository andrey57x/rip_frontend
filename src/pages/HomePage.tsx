import React from "react";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <main className="home-page">
      <Breadcrumbs items={[{ title: "Главная", to: "/" }]} />

      <section className="home-content">
        <h1 className="home-title">
          Добро пожаловать на сайт по расчету входных веществ в химической
          реакции
        </h1>
        <p className="home-text">
          Здесь вы можете ознакомиться с различными химическими реакциями, их
          исходными реагентами и целевыми продуктами. Используйте страницу
          «Реакции» для поиска и фильтрации интересующих вас процессов.
        </p>
      </section>
    </main>
  );
};

export default HomePage;
