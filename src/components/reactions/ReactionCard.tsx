import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { selectIsAuthenticated } from "../../slices/authSlice";
import {
  addToDraft,
  selectLoadingReactionId,
} from "../../slices/calculationSlice";
import ImageWithFallback from "../ui/ImageWithFallback";
import type { Reaction } from "../../types/models";
import "./ReactionCard.css";

type Props = {
  reaction: Reaction;
};

const ReactionCard: React.FC<Props> = ({ reaction }) => {
  const dispatch: AppDispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loadingReactionId = useSelector(selectLoadingReactionId);

  const isLoading = loadingReactionId === reaction.id;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    dispatch(addToDraft(reaction.id));
  };

  return (
    <Link to={`/reactions/${reaction.id}`} className="reaction-link">
      <article
        className="reaction-card"
        aria-labelledby={`reaction-title-${reaction.id}`}
      >
        <div className="reaction-img-wrap">
          <ImageWithFallback
            src={reaction.img_link ?? undefined}
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

          {isAuthenticated && (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? "Добавление..." : "В расчет"}
            </button>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ReactionCard;
