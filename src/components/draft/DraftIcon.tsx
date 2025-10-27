import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  selectDraftInfo,
  selectCartStatus,
} from "../../slices/calculationSlice";
import { selectIsAuthenticated } from "../../slices/authSlice";
import { MINIO_PATH } from "../../config/config";
import "./DraftIcon.css";

const DraftIcon: React.FC = () => {
  const draftInfo = useSelector(selectDraftInfo);
  const cartStatus = useSelector(selectCartStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (
    !isAuthenticated ||
    location.pathname === "/draft" ||
    cartStatus === "idle" ||
    cartStatus === "loading"
  ) {
    return null;
  }

  const draftId = draftInfo?.id;
  const count = draftInfo?.reactions_count || 0;
  const cartIconUrl = draftInfo?.cart_icon;

  const isActive = count > 0 && draftId != null;
  const finalIconUrl = cartIconUrl ? `${MINIO_PATH}${cartIconUrl}` : "";

  const IconComponent = finalIconUrl ? (
    <img src={finalIconUrl} alt="Иконка черновика" className="draft-icon-img" />
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
  );

  const linkDestination = isActive ? "/draft" : location.pathname;

  return (
    <Link
      to={linkDestination}
      className={`draft-link ${!isActive ? "disabled" : ""}`}
      aria-label={`Черновик расчета массы, ${count} элементов`}
      onClick={(e) => {
        if (!isActive) {
          e.preventDefault();
        }
      }}
    >
      <div className="draft-icon-wrapper">
        {IconComponent}
        {isActive && <span className="draft-count">{count}</span>}
      </div>
    </Link>
  );
};

export default DraftIcon;
