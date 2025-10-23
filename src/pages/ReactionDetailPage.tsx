import React from "react";
import { useParams, Link } from "react-router-dom";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import useFetchReaction from "../hooks/useFetchReaction";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import type { Reaction } from "../types/models";
import "./ReactionDetailPage.css";

const ReactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetchReaction(id);

  const reaction = data as Reaction | null;

  return (
    <main className="reaction-detail-page">
      <Breadcrumbs
        items={[
          { title: "Главная", to: "/" },
          { title: "Реакции", to: "/reactions" },
          { title: reaction ? reaction.title : "Загрузка..." },
        ]}
      />

      <div className="detail-container">
        {loading && <div className="detail-status">Загрузка...</div>}

        {!loading && !error && !reaction && (
          <div className="detail-status">Реакция не найдена.</div>
        )}

        {reaction && (
          <article className="detail-card">
            <div className="detail-header">
              <h1 className="detail-title">{reaction.title}</h1>
              <div className="detail-meta">
                <Link to="/reactions" className="back-link">
                  ← Назад к списку
                </Link>
              </div>
            </div>

            <div className="detail-content">
              <div className="detail-image-wrap">
                <ImageWithFallback
                  src={reaction.img_link ?? undefined}
                  alt={reaction.title}
                  className="detail-image"
                  lazy={false}
                />
              </div>

              <div className="detail-text">
                <p className="detail-row">
                  <span className="detail-label">Исходный реагент:</span>{" "}
                  <span className="detail-value">
                    {reaction.reagent ?? "-"}
                  </span>
                </p>
                <p className="detail-row">
                  <span className="detail-label">Целевой продукт:</span>{" "}
                  <span className="detail-value">
                    {reaction.product ?? "-"}
                  </span>
                </p>
                <p className="detail-row">
                  <span className="detail-label">
                    Коэффициент преобразования:
                  </span>{" "}
                  <span className="detail-value">
                    {reaction.conversation_factor ?? "-"}
                  </span>
                </p>

                <h3 className="desc-title">Описание процесса</h3>
                <p className="desc-text">{reaction.description ?? "-"}</p>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
};

export default ReactionDetailPage;
