import React from "react";
import ReactionCard from "./ReactionCard";
import "./ReactionsGrid.css";
import type { Reaction } from "../../types/models";

type Props = {
  reactions: Reaction[];
};

const ReactionsGrid: React.FC<Props> = ({ reactions }) => {
  if (!reactions || reactions.length === 0) {
    return (
      <div className="reactions-grid-empty">Нет реакций для отображения.</div>
    );
  }

  return (
    <section className="reactions-grid-wrap" aria-label="Список реакций">
      <div className="reactions-grid">
        {reactions.map((r) => (
          <ReactionCard key={r.id} reaction={r} />
        ))}
      </div>
    </section>
  );
};

export default ReactionsGrid;
