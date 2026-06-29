import React from "react";

const Spinner = ({ size = "md", className = "", ...props }) => {
  const sizeClasses = {
    xs: "h-4 w-4 border-2",
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`rounded-full border-zinc-800 border-t-white animate-spin ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    />
  );
};

export default Spinner;
