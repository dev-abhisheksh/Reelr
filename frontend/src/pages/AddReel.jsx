import React from 'react';
import { MdAddCircleOutline } from "react-icons/md";

const AddReel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white/80 gap-3">
      <MdAddCircleOutline size={50} className="text-purple-400 animate-pulse" />
      <h2 className="text-xl font-semibold">Upload Page</h2>
      <p className="text-sm text-white/60">This page is currently under development 🚧</p>
    </div>
  );
};

export default AddReel;
