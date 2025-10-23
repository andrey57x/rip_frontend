import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

type Crumb = {
  title: string;
  to?: string;
};

type Props = {
  items?: Crumb[];
  linkLast?: boolean;
};

const Breadcrumbs: React.FC<Props> = ({ items, linkLast = false }) => {
  const location = useLocation();

  const buildFromPath = (): Crumb[] => {
    const path = location.pathname || "/";
    if (path === "/" || path === "") return [{ title: "Главная", to: "/" }];

    const parts = path.split("/").filter(Boolean);
    const crumbs: Crumb[] = [{ title: "Главная", to: "/" }];

    let acc = "";
    parts.forEach((p) => {
      acc += `/${p}`;
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
