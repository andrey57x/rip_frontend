import React from "react";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import FilterPanel from "../components/reactions/FiltersPanel";
import ReactionCard from "../components/reactions/ReactionCard";
import useFetchReactions from "../hooks/useFetchReactions";
import "./ReactionsPage.css";

const ReactionsPage: React.FC = () => {
  const { data: reactions, loading, error } = useFetchReactions();

  return (
    <main className="reactions-page">
      {/* Хлебные крошки */}
      <Breadcrumbs
        items={[
          { title: "Главная", to: "/" },
          { title: "Реакции", to: "/reactions" },
        ]}
      />

      <FilterPanel />

      {loading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}

      <div className="reaction-cards-container">
        {reactions.map((r) => (
          <ReactionCard key={r.id} reaction={r} />
        ))}
      </div>
    </main>
  );
};

export default ReactionsPage;
