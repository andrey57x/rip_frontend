import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch } from "../store/store";
import { fetchHistory, selectCalculationsHistory, selectCalculationsStatus } from "../slices/calculationSlice";
import { selectUser } from "../slices/authSlice";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import "./CalculationsListPage.css";

const CalculationsListPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useSelector(selectCalculationsHistory);
    const status = useSelector(selectCalculationsStatus);
    const user = useSelector(selectUser);

    const [filters, setFilters] = useState({
        "from-date": "",
        "to-date": "",
        status: "",
        creator: "",
    });

    useEffect(() => {
        const backendFilters = {
            "from-date": filters["from-date"] || undefined,
            "to-date": filters["to-date"] || undefined,
            status: filters.status || undefined,
        };
        dispatch(fetchHistory(backendFilters));

        const intervalId = setInterval(() => {
            dispatch(fetchHistory(backendFilters));
        }, 5000);

        return () => clearInterval(intervalId);
    }, [dispatch, filters["from-date"], filters["to-date"], filters.status]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredHistory = useMemo(() => {
        if (!filters.creator) {
            return history;
        }
        return history.filter(calc => 
            calc.creator_login.toLowerCase().includes(filters.creator.toLowerCase())
        );
    }, [history, filters.creator]);
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };
    
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'draft': return 'status-draft';
            case 'formed': return 'status-formed';
            case 'completed': return 'status-completed';
            case 'rejected': return 'status-rejected';
            default: return 'status-draft';
        }
    };

    return (
        <>
            <Breadcrumbs items={[{ title: "Главная", to: "/" }, { title: "Мои расчеты" }]} />
            <main className="calc-history-page">
                <div className="calc-history-header">
                    <h1 className="calc-history-title">История расчетов массы</h1>
                </div>

                {user?.isModerator && (
                    <div className="filters-container">
                        <input type="date" name="from-date" value={filters["from-date"]} onChange={handleFilterChange} />
                        <input type="date" name="to-date" value={filters["to-date"]} onChange={handleFilterChange} />
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">Все статусы</option>
                            <option value="draft">Черновик</option>
                            <option value="formed">Сформирован</option>
                            <option value="completed">Завершен</option>
                            <option value="rejected">Отклонен</option>
                        </select>
                        <input type="text" name="creator" placeholder="Фильтр по автору..." value={filters.creator} onChange={handleFilterChange} />
                    </div>
                )}

                {status === 'loading' && history.length === 0 && <p className="loading-spinner">Загрузка истории...</p>}
                
                {status !== 'loading' && filteredHistory.length === 0 && (
                    <p className="draft-empty-message">Расчеты не найдены.</p>
                )}

                {filteredHistory.length > 0 && (
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
                            {filteredHistory.map((calc) => (
                                <tr key={calc.id}>
                                    <td>#{calc.id}</td>
                                    <td>{formatDate(calc.date_create)}</td>
                                    <td><span className={`status-badge ${getStatusClass(calc.status)}`}>{calc.status}</span></td>
                                    <td>{calc.creator_login}</td>
                                    <td><Link to={`/calculations/${calc.id}`} className="details-link">Подробнее</Link></td>
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