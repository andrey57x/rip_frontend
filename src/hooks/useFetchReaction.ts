// src/hooks/useFetchReaction.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { Reaction } from "../types/models";
import * as api from "../api/api";

export default function useFetchReaction(id?: number | string) {
  const [data, setData] = useState<Reaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchOne = useCallback(async (ident?: number | string) => {
    if (!ident && ident !== 0) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getReaction(ident!, ac.signal);
      setData(res);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message ?? "fetch error");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id === undefined || id === null) return;
    fetchOne(id);
    return () => {
      abortRef.current?.abort();
    };
  }, [id, fetchOne]);

  const refetch = () => fetchOne(id);

  return { data, loading, error, refetch };
}
