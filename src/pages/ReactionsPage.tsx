import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import FilterPanel from "../components/reactions/FiltersPanel";
import ReactionsGrid from "../components/reactions/ReactionsGrid";
import useFetchReactions from "../hooks/useFetchReactions";
import "./ReactionsPage.css";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchTerm, setSearchTerm } from "../slices/filterSlice";
import DraftIcon from "../components/draft-icon/DraftIcon";
import { getCartInfo } from "../api/api";

interface CartInfo {
  id: number;
  reactions_count: number;
  cart_icon?: string;
}

const ReactionsPage: React.FC = () => {
  const searchTerm = useSelector(selectSearchTerm);
  const dispatch = useDispatch();
  const [cartInfo, setCartInfo] = useState<CartInfo | null>(null);
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
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getCartInfo(controller.signal)
      .then((data) => setCartInfo(data))
      .catch((err) => console.error("Failed to fetch cart info:", err));
    return () => controller.abort();
  }, []);

  const handleSearch = () => {
    setFiltersAndFetch({ reaction_title: searchTerm });
  };

  const handleFilterChange = (newValue: string) => {
    dispatch(setSearchTerm(newValue));
  };

  return (
    <main className="reactions-page">
      <DraftIcon
        count={cartInfo?.reactions_count}
        iconUrl={cartInfo?.cart_icon}
      />

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

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Загрузка...</p>}

      {!loading && <ReactionsGrid reactions={reactions} />}
    </main>
  );
};

export default ReactionsPage;
