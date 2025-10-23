import { useCallback, useRef, useState } from "react";
import type { Reaction } from "../types/models";
import * as api from "../api/api";
import mockReactions from "../mock/reactions.json";

type Filters = {
  reaction_title?: string;
};

export default function useFetchReactions() {
  const [data, setData] = useState<Reaction[]>([]);
  const [fullReactionList, setFullReactionList] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const filterLocally = (searchTerm: string) => {
    const sourceList =
      fullReactionList.length > 0 ? fullReactionList : mockReactions;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    if (!lowerCaseSearchTerm) {
      setData(sourceList);
      return;
    }

    const filtered = sourceList.filter((reaction) =>
      reaction.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setData(filtered);
  };

  const fetchData = useCallback(
    async (filters?: Filters) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setLoading(true);
      setError(null);

      try {
        const res = await api.getReactions(filters, ac.signal);
        setData(res);
        if (!filters || !filters.reaction_title) {
          setFullReactionList(res);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
        setError("Сервер недоступен. Поиск выполняется по локальным данным.");
        filterLocally(filters?.reaction_title || "");
      } finally {
        setLoading(false);
      }
    },
    [fullReactionList]
  );

  const setFiltersAndFetch = (f: Filters) => {
    fetchData(f);
  };

  return {
    data,
    loading,
    error,
    setFiltersAndFetch,
  };
}
