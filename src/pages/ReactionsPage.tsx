import React, { useEffect, useRef } from "react";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import FilterPanel from "../components/reactions/FiltersPanel";
import ReactionsGrid from "../components/reactions/ReactionsGrid";
import useFetchReactions from "../hooks/useFetchReactions";
import "./ReactionsPage.css";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchTerm, setSearchTerm } from "../slices/filterSlice";

const ReactionsPage: React.FC = () => {
  const searchTerm = useSelector(selectSearchTerm);
  const dispatch = useDispatch();

  const isInitialMount = useRef(true);
  const {
    data: reactions,
    loading,
    error,
    setFiltersAndFetch,
  } = useFetchReactions();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setFiltersAndFetch({ reaction_title: searchTerm });
    }
  }, [searchTerm, setFiltersAndFetch]);

  const handleSearch = (query: string) => {
    dispatch(setSearchTerm(query));
    setFiltersAndFetch({ reaction_title: query });
  };

  const handleFilterChange = (newValue: string) => {
    dispatch(setSearchTerm(newValue));
  };

  return (
    <main className="reactions-page">
      <Breadcrumbs
        items={[
          { title: "Главная", to: "/" },
          { title: "Реакции", to: "/reactions" },
        ]}
      />

      <FilterPanel
        value={searchTerm}
        onChange={handleFilterChange}
        onSearch={() => handleSearch(searchTerm)}
      />

      {loading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}

      {!loading && !error && <ReactionsGrid reactions={reactions} />}
    </main>
  );
};

export default ReactionsPage;
