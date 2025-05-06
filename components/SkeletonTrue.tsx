import React from "react";

export default function SkeletonTrue({ className }: { className: string }) {
  return (
    <div className={className + " relative"}>
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
    </div>
  );
}
