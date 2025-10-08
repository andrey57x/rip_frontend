import React from "react";
import { DEFAULT_IMG } from "../../utils/constants";

type Props = {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  /** если true — добавит loading="lazy" */
  lazy?: boolean;
};

/**
 * Надёжный компонент изображения с fallback и защитой от бесконечного onError-loop.
 * Устанавливает data-fallback-applied="true" после первой неудачной загрузки.
 */
const ImageWithFallback: React.FC<Props> = ({
  src,
  alt = "",
  className,
  style,
  lazy = true,
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    // Если уже применён флаг — ничего не делаем (предотвращаем цикл)
    if (img.dataset.fallbackApplied === "true") return;

    // Пометим, чтобы не пытаться ещё раз
    img.dataset.fallbackApplied = "true";

    // Если текущий src уже равен fallback (в абсолютном формате), ничего не делаем
    try {
      const current = new URL(img.src, window.location.href).href;
      const fallback = new URL(DEFAULT_IMG, window.location.href).href;
      if (current === fallback) return;
    } catch {
      // в крайних случаях — просто продолжим и установим fallback
    }

    img.src = DEFAULT_IMG;
  };

  return (
    <img
      src={src ?? DEFAULT_IMG}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading={lazy ? "lazy" : undefined}
      // width/height можно добавить для стабильности layout
    />
  );
};

export default ImageWithFallback;
