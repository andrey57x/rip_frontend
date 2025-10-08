import React from 'react'
import Breadcrumbs from '../components/layout/Breadcrumbs'
import './HomePage.css'

const HomePage: React.FC = () => {
  return (
    <main className="home-page">
      <Breadcrumbs items={[{ title: 'Главная', to: '/' }]} />

      <section className="home-content">
        <h1 className="home-title">Добро пожаловать в лабораторию химических реакций</h1>
        <p className="home-text">
          Здесь вы можете ознакомиться с различными химическими реакциями, их исходными реагентами, целевыми продуктами и коэффициентами преобразования. 
          Используйте страницу «Реакции» для поиска и фильтрации интересующих вас процессов.
        </p>
        <p className="home-text">
          Все данные отображаются динамически и могут быть использованы для расчётов массы веществ в химических экспериментах.
        </p>
      </section>
    </main>
  )
}

export default HomePage
