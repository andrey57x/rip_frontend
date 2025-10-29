import React, { useEffect, useState } from "react";
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
  moderate,
  deleteDraft,
} from "../slices/calculationSlice";
import { selectUser } from "../slices/authSlice";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import DraftReactionItem from "../components/draft/DraftReactionItem";
import "./CalculationDetailPage.css";

const CalculationDetailPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const user = useSelector(selectUser);
  const draftInfo = useSelector(selectDraftInfo);
  const calculation = useSelector(selectCurrentCalculation);
  const status = useSelector(selectCalculationsStatus);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

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

  useEffect(() => {
    if (
      calculation?.calculation.status === "completed" &&
      calculation.completed_reactions_count < calculation.total_reactions_count
    ) {
      const intervalId = setInterval(() => {
        if (calculationId) {
          dispatch(fetchCalculationDetails(calculationId));
        }
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [calculation, calculationId, dispatch]);

  useEffect(() => {
    let timer: number;
    if (isConfirmingDelete) {
      timer = window.setTimeout(() => setIsConfirmingDelete(false), 4000);
    }
    return () => clearTimeout(timer);
  }, [isConfirmingDelete]);

  const handleConfirm = async () => {
    if (draftInfo.id) {
      const result = await dispatch(confirmCalculation(draftInfo.id));
      if (confirmCalculation.fulfilled.match(result)) {
        navigate("/calculations");
      }
    }
  };

  const handleDeleteClick = async () => {
    if (isConfirmingDelete) {
      if (draftInfo.id) {
        const result = await dispatch(deleteDraft(draftInfo.id));
        if (deleteDraft.fulfilled.match(result)) {
          navigate("/reactions");
        }
      }
    } else {
      setIsConfirmingDelete(true);
    }
  };

  const handleModerate = (newStatus: "completed" | "rejected") => {
    if (calculationId) {
      dispatch(moderate({ id: calculationId, status: newStatus }));
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
            <div className="header-meta">
              {calculation.calculation.status === "completed" && (
                <span className="progress-indicator">
                  Прогресс: {calculation.completed_reactions_count} /{" "}
                  {calculation.total_reactions_count}
                </span>
              )}
              <span
                className={`status-badge ${getStatusClass(
                  calculation.calculation.status
                )}`}
              >
                {calculation.calculation.status}
              </span>
            </div>
          )}
        </div>

        {user?.isModerator && calculation?.calculation.status === "formed" && (
          <div className="moderation-panel">
            <button
              onClick={() => handleModerate("completed")}
              className="btn-approve"
            >
              Одобрить
            </button>
            <button
              onClick={() => handleModerate("rejected")}
              className="btn-reject"
            >
              Отклонить
            </button>
          </div>
        )}

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
                  disabled={status === "loading" || isConfirmingDelete}
                >
                  {status === "loading"
                    ? "Обработка..."
                    : "Сформировать заявку"}
                </button>
                <button
                  className={`delete-draft-btn ${
                    isConfirmingDelete ? "confirm" : ""
                  }`}
                  onClick={handleDeleteClick}
                  disabled={status === "loading"}
                >
                  {isConfirmingDelete
                    ? "Подтвердить удаление"
                    : "Удалить черновик"}
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
