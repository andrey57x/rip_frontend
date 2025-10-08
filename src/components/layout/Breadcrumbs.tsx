import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

type Crumb = {
  title: string;
  to?: string;
};

type Props = {
  /* если передаёте items — будет использовано оно; иначе компонент сам построит хлебные крошки из URL */
  items?: Crumb[];
  /* отображать ли последний элемент как ссылку (по умолчанию false — текущая страница не ссылка) */
  linkLast?: boolean;
};

/**
 * Breadcrumbs
 * - если items не переданы — строит на основе useLocation().pathname
 * - автоматически аккумулирует пути ("/reactions/123" -> ["/reactions","/reactions/123"])
 *
 * Пример использования:
 *  <Breadcrumbs />                       // авто-построение
 *  <Breadcrumbs items={[{title: 'Главная', to: '/'}, {title: 'Реакции'}]} />
 */
const Breadcrumbs: React.FC<Props> = ({ items, linkLast = false }) => {
  const location = useLocation();

  const buildFromPath = (): Crumb[] => {
    const path = location.pathname || "/";
    if (path === "/" || path === "") return [{ title: "Главная", to: "/" }];

    const parts = path.split("/").filter(Boolean); // убираем пустые сегменты
    const crumbs: Crumb[] = [{ title: "Главная", to: "/" }];

    let acc = "";
    parts.forEach((p) => {
      acc += `/${p}`;
      // преобразуем сегмент в человекочитаемое название:
      // если сегмент — число (id), покажем 'Детали' (можно заменить по задаче)
      const title = /^\d+$/.test(p)
        ? "Детали"
        : decodeURIComponent(p).replace(/-/g, " ");
      crumbs.push({ title: capitalize(title), to: acc });
    });
    return crumbs;
  };

  const capitalize = (s: string) =>
    s.length ? s[0].toUpperCase() + s.slice(1) : s;

  const crumbs = items && items.length ? items : buildFromPath();

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-wrap">
      <ol className="breadcrumb-list">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          const shouldLink = !!c.to && (!isLast || linkLast);
          return (
            <li key={i} className={`breadcrumb-item ${isLast ? "active" : ""}`}>
              {shouldLink ? (
                <Link to={c.to!} className="breadcrumb-link">
                  {c.title}
                </Link>
              ) : (
                <span className="breadcrumb-text">{c.title}</span>
              )}
              {!isLast && <span className="breadcrumb-sep">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
