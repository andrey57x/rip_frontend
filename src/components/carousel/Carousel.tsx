import React from "react";
import { Carousel } from "react-bootstrap";
import "./Carousel.css";

const ProjectCarousel: React.FC = () => {
  return (
    <div className="carousel-container">
      <Carousel fade>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={`${import.meta.env.BASE_URL}/img/stechiometry.png`}
            alt="Основы стехиометрии"
          />
          <Carousel.Caption>
            <h3>Основы стехиометрии</h3>
            <p>Изучайте количественные соотношения между реагентами и продуктами в химических реакциях.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={`${import.meta.env.BASE_URL}/img/ammiak.jpg`}
            alt="Синтез аммиака"
          />
          <Carousel.Caption>
            <h3>Промышленные процессы</h3>
            <p>Исследуйте важные промышленные реакции, такие как синтез аммиака.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={`${import.meta.env.BASE_URL}/img/reactions.jpg`}
            alt="Разнообразие реакций"
          />
          <Carousel.Caption>
            <h3>Разнообразие реакций</h3>
            <p>От кислотно-основных до окислительно-восстановительных — находите и анализируйте процессы.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default ProjectCarousel;