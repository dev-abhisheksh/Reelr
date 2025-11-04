import React from 'react';
import { FaSearch } from "react-icons/fa";

const SearchPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white/80 gap-3">
      <FaSearch size={45} className="text-green-400 animate-pulse" />
      <h2 className="text-xl font-semibold">Search Page</h2>
      <p className="text-sm text-white/60">This page is currently under development 🚧</p>
    </div>
  );
};

export default SearchPage;
