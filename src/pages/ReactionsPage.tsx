import React, { useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import FilterPanel from "../components/reactions/FiltersPanel";
import ReactionsGrid from "../components/reactions/ReactionsGrid";
import useFetchReactions from "../hooks/useFetchReactions";
import { selectSearchTerm, setSearchTerm } from "../slices/filterSlice";
import { selectIsAuthenticated } from "../slices/authSlice";
import {
  fetchDraftInfo,
  fetchDraftReactionIds,
  selectCalculationsError,
  selectCalculationsStatus,
} from "../slices/calculationSlice";
import DraftIcon from "../components/draft/DraftIcon";
import "./ReactionsPage.css";

const ReactionsPage: React.FC = () => {
  const searchTerm = useSelector(selectSearchTerm);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch: AppDispatch = useDispatch();

  const calculationError = useSelector(selectCalculationsError);
  const calculationStatus = useSelector(selectCalculationsStatus);

  const isInitialMount = useRef(true);
  const {
    data: reactions,
    loading,
    error,
    setFiltersAndFetch,
  } = useFetchReactions();

  const sortedReactions = useMemo(() => {
    return [...reactions].sort((a, b) => a.title.localeCompare(b.title));
  }, [reactions]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setFiltersAndFetch({ reaction_title: searchTerm });
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isAuthenticated) {
        const resultAction = await dispatch(fetchDraftInfo());
        if (fetchDraftInfo.fulfilled.match(resultAction)) {
          const id = resultAction.payload.id;
          if (id) {
            dispatch(fetchDraftReactionIds(id));
          }
        }
      }
    };
    fetchInitialData();
  }, [isAuthenticated, dispatch]);

  const handleSearch = () => {
    setFiltersAndFetch({ reaction_title: searchTerm });
  };

  const handleFilterChange = (newValue: string) => {
    dispatch(setSearchTerm(newValue));
  };

  return (
    <main className="reactions-page">
      <DraftIcon />

      <Breadcrumbs
        items={[
          { title: "Главная", to: "/" },
          { title: "Реакции", to: "/reactions" },
        ]}
      />

      <FilterPanel
        value={searchTerm}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {calculationStatus === "failed" && calculationError && (
        <p className="error-message">{calculationError}</p>
      )}

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Загрузка...</p>}

      {!loading && <ReactionsGrid reactions={sortedReactions} />}
    </main>
  );
};

export default ReactionsPage;
