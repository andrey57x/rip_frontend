// ./pages/ReactionsPage.tsx

import React, { useState, useEffect, useRef } from "react"; // <--- ДОБАВЛЕНО useRef
import Breadcrumbs from "../components/layout/Breadcrumbs";
import FilterPanel from "../components/reactions/FiltersPanel";
import ReactionsGrid from "../components/reactions/ReactionsGrid";
import useFetchReactions from "../hooks/useFetchReactions";
import "./ReactionsPage.css";

const ReactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isInitialMount = useRef(true); // <--- НОВЫЙ ХУК: Для контроля первого монтирования

  const {
    data: reactions,
    loading,
    error,
    setFiltersAndFetch,
  } = useFetchReactions();

  // Загружаем все реакции при первом рендере страницы
  useEffect(() => {
    // В режиме StrictMode компонент монтируется, размонтируется и монтируется снова.
    // Если это первое (или повторное StrictMode) монтирование, мы его пропускаем,
    // чтобы выполнить запрос только один раз.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setFiltersAndFetch({});
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Функция, которая будет вызвана при нажатии кнопки "Поиск"
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    // Отправляем запрос с параметром reaction_title
    setFiltersAndFetch({ reaction_title: query });
  };

  return (
    <main className="reactions-page">
      {/* Хлебные крошки */}
      <Breadcrumbs
        items={[
          { title: "Главная", to: "/" },
          { title: "Реакции", to: "/reactions" },
        ]}
      />

      {/* Передаем value и onSearch в FilterPanel */}
      <FilterPanel
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
      />

      {loading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}

      {/* Отображаем результат через ReactionsGrid */}
      {!loading && !error && <ReactionsGrid reactions={reactions} />}
    </main>
  );
};

export default ReactionsPage;
