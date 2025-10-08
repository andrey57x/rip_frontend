// Небольшие утилиты для форматирования на фронте

/**
 * Форматировать float с заданным количеством знаков после запятой
 */
export const formatFloat = (v: number | null | undefined, digits = 3): string =>
  typeof v === "number" ? v.toFixed(digits) : "-";

/**
 * Обрезать длинный текст до max символов и добавить многоточие
 */
export const ellipsis = (s?: string | null, max = 150): string => {
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1).trim() + "…" : s;
};

/**
 * Преобразовать ISO-дату в более читабельную строку (локаль)
 */
export const formatDate = (iso?: string | null): string => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  } catch {
    return iso;
  }
};
