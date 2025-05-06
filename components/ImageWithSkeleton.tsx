import React, { useState, useEffect } from "react";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  width = "100%",
  height = "auto",
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };

    image.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        backgroundColor: isLoading ? "#f0f0f0" : "transparent",
      }}
      className={className}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            borderRadius: "4px",
          }}
        />
      )}

      {!isLoading && !hasError && (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {hasError && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
          }}
        >
          Erreur de chargement
        </div>
      )}

      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ImageWithSkeleton;
