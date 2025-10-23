import React from "react";
import "./DraftIcon.css";
import { MINIO_PATH } from "../../config/config";

type Props = {
  count?: number;
  iconUrl?: string; 
};

const DraftIcon: React.FC<Props> = ({ count = 0, iconUrl }) => {
  const isActive = count > 0;

  const finalIconUrl = iconUrl ? `${MINIO_PATH}${iconUrl}` : "";

  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`draft-link ${!isActive ? "disabled" : ""}`}
      aria-label={`Черновик расчета, ${count} элементов`}
    >
      <div className="draft-icon-wrapper">
        {finalIconUrl ? (
          <img
            src={finalIconUrl}
            alt="Иконка черновика"
            className="draft-icon-img"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="draft-icon-svg"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="12" y1="10" x2="12" y2="18"></line>
            <line x1="8" y1="14" x2="16" y2="14"></line>
          </svg>
        )}

        {isActive && <span className="draft-count">{count}</span>}
      </div>
    </a>
  );
};

export default DraftIcon;
