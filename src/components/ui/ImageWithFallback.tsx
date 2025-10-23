import React from "react";
import { DEFAULT_IMG, MINIO_PATH } from "../../config/config";

type Props = {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
};

const ImageWithFallback: React.FC<Props> = ({
  src,
  alt = "",
  className,
  style,
  lazy = true,
}) => {
  const finalSrc = src ? `${MINIO_PATH}${src}` : DEFAULT_IMG;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied === "true") return;
    img.dataset.fallbackApplied = "true";
    img.src = DEFAULT_IMG;
  };

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading={lazy ? "lazy" : undefined}
    />
  );
};

export default ImageWithFallback;
