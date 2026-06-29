import React from "react";

const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-800 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
