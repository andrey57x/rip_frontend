import React from "react";
import { Link } from "react-router-dom";
import "./ReactionCard.css";
import ImageWithFallback from "../ui/ImageWithFallback";
import type { Reaction } from "../../types/models";

type Props = {
  reaction: Reaction;
};

const ReactionCard: React.FC<Props> = ({ reaction }) => {
  const imgSrc = reaction.img_link ?? undefined;

  return (
    <Link to={`/reactions/${reaction.id}`} className="reaction-link">
      <article
        className="reaction-card"
        aria-labelledby={`reaction-title-${reaction.id}`}
      >
        <div className="reaction-img-wrap">
          <ImageWithFallback
            src={imgSrc}
            alt={reaction.title}
            className="reaction-img"
            lazy={true}
          />
        </div>

        <div className="reaction-body">
          <h3 id={`reaction-title-${reaction.id}`} className="reaction-title">
            {reaction.title}
          </h3>

          <p className="reaction-sub">
            Исходный реагент:{" "}
            <span className="reaction-sub-value">
              {reaction.reagent ?? "-"}
            </span>
          </p>
          <p className="reaction-sub">
            Целевой продукт:{" "}
            <span className="reaction-sub-value">
              {reaction.product ?? "-"}
            </span>
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ReactionCard;
