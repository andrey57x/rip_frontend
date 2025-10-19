// ./api/api.ts
import { API_BASE, USE_MOCK } from "../config/config";
import type { Reaction } from "../types/models";
import mockReactions from "../mock/reactions.json";

type Filters = {
  reaction_title?: string;
  limit?: number;
  offset?: number;
};


const toQuery = (filters?: Filters) => {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
};

export async function getReactions(
  filters?: Filters,
  signal?: AbortSignal
): Promise<Reaction[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockReactions as Reaction[]);
  }

  const qs = toQuery(filters);
  const url = `${API_BASE}/reactions${qs}`;

  try {
    const res = await fetch(url, { signal, credentials: "include" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = (await res.json()) as Reaction[];
    return json;
  } catch (err: any) {
    // Если это ошибка отмены, её нужно перебросить
    if (err?.name === "AbortError") {
      throw err;
    }

    console.warn("api.getReactions network error, falling back to mock", err);
    return mockReactions as Reaction[];
  }
}

export async function getReaction(
  id: number | string,
  signal?: AbortSignal
): Promise<Reaction | null> {
  if (USE_MOCK) {
    const found =
      (mockReactions as Reaction[]).find((r) => String(r.id) === String(id)) ||
      null;
    return Promise.resolve(found);
  }

  const url = `${API_BASE}/reactions/${id}`;
  try {
    const res = await fetch(url, { signal, credentials: "include" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = (await res.json()) as Reaction;
    return json;
  } catch (err: any) {
    // Если это ошибка отмены, её нужно перебросить
    if (err?.name === "AbortError") {
      throw err;
    }

    console.warn("api.getReaction network error, falling back to mock", err);
    const found =
      (mockReactions as Reaction[]).find((r) => String(r.id) === String(id)) ||
      null;
    return found;
  }
}
