import React from 'react';
import { HiHome } from "react-icons/hi2";

const HomePge = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white/80 gap-3">
      <HiHome size={50} className="text-blue-400 animate-pulse" />
      <h2 className="text-xl font-semibold">Home Page</h2>
      <p className="text-sm text-white/60">This page is currently under development 🚧</p>
    </div>
  );
};

export default HomePge;
