import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch } from "../store/store";
import {
  fetchHistory,
  selectCalculationsHistory,
  selectCalculationsStatus,
} from "../slices/calculationSlice";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import "./CalculationsListPage.css";

const CalculationsListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const history = useSelector(selectCalculationsHistory);
  const status = useSelector(selectCalculationsStatus);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

  return (
    <>
      <Breadcrumbs
        items={[{ title: "Главная", to: "/" }, { title: "Мои расчеты" }]}
      />
      <main className="calc-history-page">
        <div className="calc-history-header">
          <h1 className="calc-history-title">История расчетов массы</h1>
        </div>

        {status === "loading" && (
          <p className="loading-spinner">Загрузка истории...</p>
        )}

        {status !== "loading" && history.length === 0 && (
          <p className="draft-empty-message">
            У вас еще нет ни одного расчета.
          </p>
        )}

        {status !== "loading" && history.length > 0 && (
          <table className="calc-history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th>Автор</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {history.map((calc) => (
                <tr key={calc.id}>
                  <td>#{calc.id}</td>
                  <td>{formatDate(calc.date_create)}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(calc.status)}`}
                    >
                      {calc.status}
                    </span>
                  </td>
                  <td>{calc.creator_login}</td>
                  <td>
                    <Link
                      to={`/calculations/${calc.id}`}
                      className="details-link"
                    >
                      Подробнее
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
};

export default CalculationsListPage;
