import React, { useEffect } from "react";
import type { AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectDraftInfo,
  selectCurrentCalculation,
  selectCalculationsStatus,
  fetchCalculationDetails,
  confirmCalculation,
  clearCurrentCalculation,
} from "../slices/calculationSlice";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import DraftReactionItem from "../components/draft/DraftReactionItem";
import "./CalculationDetailPage.css";

const CalculationDetailPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const draftInfo = useSelector(selectDraftInfo);
  const calculation = useSelector(selectCurrentCalculation);
  const status = useSelector(selectCalculationsStatus);

  const calculationId = id ? parseInt(id, 10) : draftInfo.id;
  const isDraft = !id && calculation?.calculation.status === "draft";

  useEffect(() => {
    if (calculationId) {
      dispatch(fetchCalculationDetails(calculationId));
    }
    return () => {
      dispatch(clearCurrentCalculation());
    };
  }, [calculationId, dispatch]);

  const handleConfirm = async () => {
    if (draftInfo.id) {
      const result = await dispatch(confirmCalculation(draftInfo.id));
      if (confirmCalculation.fulfilled.match(result)) {
        navigate("/calculations");
      }
    }
  };

  const isLoading = status === "loading" && !calculation;
  const isEmpty =
    !calculation ||
    !calculation.reactions ||
    calculation.reactions.length === 0;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "draft":
        return "status-draft";
      case "formed":
        return "status-formed";
      case "completed":
        return "status-completed";
      case "rejected":
        return "status-rejected";
      default:
        return "status-draft";
    }
  };

  const breadcrumbTitle = isDraft
    ? "Текущий расчет массы"
    : `Расчет массы #${calculationId}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Главная", to: "/" },
          { title: "Мои расчеты", to: "/calculations" },
          { title: breadcrumbTitle },
        ]}
      />
      <main className="calculation-detail-page">
        <div className="calculation-detail-header">
          <h1 className="calculation-detail-title">{breadcrumbTitle}</h1>
          {calculation && (
            <span
              className={`status-badge ${getStatusClass(
                calculation.calculation.status
              )}`}
            >
              {calculation.calculation.status}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : isEmpty ? (
          <p className="draft-empty-message">Расчет не содержит реакций.</p>
        ) : (
          <>
            <div className="draft-item-list">
              {calculation.reactions.map((item) => (
                <DraftReactionItem
                  key={item.reaction.id}
                  item={item}
                  calculationId={calculation.calculation.id}
                  isDraft={isDraft}
                />
              ))}
            </div>

            {isDraft && (
              <div className="draft-actions">
                <button
                  className="confirm-draft-btn"
                  onClick={handleConfirm}
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? "Обработка..."
                    : "Сформировать заявку"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default CalculationDetailPage;
