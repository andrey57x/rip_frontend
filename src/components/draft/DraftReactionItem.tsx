import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { updateMass, removeFromDraft } from "../../slices/calculationSlice";
import { MINIO_PATH } from "../../config/config";
import useDebounce from "../../hooks/useDebounce";
import "./DraftReactionItem.css";

type ReactionItem = {
  reaction: {
    id: number;
    title: string;
    reagent: string;
    product: string;
    img_link?: string | null;
  };
  output_mass: number;
  input_mass: number;
};

type Props = {
  item: ReactionItem;
  calculationId: number;
  isDraft: boolean;
};

const DraftReactionItem: React.FC<Props> = ({
  item,
  calculationId,
  isDraft,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [mass, setMass] = useState(item.output_mass.toString());
  const debouncedMass = useDebounce(mass, 500);

  useEffect(() => {
    if (!isDraft) return;

    const numericMass = parseFloat(debouncedMass);
    if (!isNaN(numericMass) && numericMass !== item.output_mass) {
      dispatch(
        updateMass({
          calculationId,
          reactionId: item.reaction.id,
          output_mass: numericMass,
        })
      );
    }
  }, [
    debouncedMass,
    item.output_mass,
    calculationId,
    item.reaction.id,
    dispatch,
    isDraft,
  ]);

  const handleRemove = () => {
    dispatch(removeFromDraft({ calculationId, reactionId: item.reaction.id }));
  };

  const imgSrc = item.reaction.img_link
    ? `${MINIO_PATH}${item.reaction.img_link}`
    : "/img/default-reaction.png";

  return (
    <article className="draft-item">
      <Link
        to={`/reactions/${item.reaction.id}`}
        className="draft-item-link-area"
      >
        <div className="draft-item-img-wrap">
          <img
            src={imgSrc}
            alt={item.reaction.title}
            className="draft-item-img"
          />
        </div>
      </Link>
      <div className="draft-item-info">
        <Link
          to={`/reactions/${item.reaction.id}`}
          className="draft-item-link-area"
        >
          <h3 className="draft-item-title">{item.reaction.title}</h3>
          <p className="draft-item-details">
            Исходный реагент: {item.reaction.reagent} → Продукт:{" "}
            {item.reaction.product}
          </p>
        </Link>
        <div className="mass-input-group">
          <label
            htmlFor={`mass-${item.reaction.id}`}
            className="mass-input-label"
          >
            Целевая масса (г):
          </label>
          <input
            id={`mass-${item.reaction.id}`}
            type="number"
            value={mass}
            onChange={(e) => setMass(e.target.value)}
            className="mass-input"
            readOnly={!isDraft}
          />
        </div>
        {item.input_mass > 0 && (
          <p className="draft-item-details calculated-mass">
            <strong>
              Расчетная исходная масса: {item.input_mass.toFixed(2)} г
            </strong>
          </p>
        )}
      </div>
      <div className="draft-item-actions">
        {isDraft && (
          <button
            onClick={handleRemove}
            className="draft-item-remove-btn"
            title="Удалить из расчета"
          >
            Удалить
          </button>
        )}
      </div>
    </article>
  );
};

export default DraftReactionItem;
