import { useEffect, useState } from "react";

/**
 * useDebounce - возвращает отложенное значение value через delay мс.
 * Полезно для debounced-поиска.
 */
export default function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
