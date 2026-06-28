import React, { useState } from "react";
import { X, LogOut, Monitor, ShieldAlert } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogoutAction = async (allDevices) => {
    setLoading(true);
    try {
      await onLogout(allDevices);
    } catch (error) {
      console.error("Logout action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-zinc-950/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform scale-100 flex flex-col gap-6 p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 text-white">
            <LogOut size={20} className="text-orange-500" />
            <h2 className="text-lg font-semibold tracking-wide">Confirm Log Out</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-400 hover:text-white rounded-full p-1 hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info */}
        <div className="text-sm text-zinc-400 leading-relaxed">
          Select your logout option. Logging out of all devices will revoke all active sessions, including this browser.
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {/* Option 1: Current Device */}
          <button
            onClick={() => handleLogoutAction(false)}
            disabled={loading}
            className="w-full text-left p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 rounded-xl flex items-center gap-4 transition-all duration-200 group cursor-pointer"
          >
            <div className="bg-zinc-850 group-hover:bg-orange-500/10 p-2.5 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
              <Monitor size={20} />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Log out of this device</div>
              <div className="text-xs text-zinc-500 mt-0.5">Clears session on this browser only</div>
            </div>
          </button>

          {/* Option 2: All Devices */}
          <button
            onClick={() => handleLogoutAction(true)}
            disabled={loading}
            className="w-full text-left p-4 bg-zinc-900 border border-zinc-800 hover:border-red-900/50 hover:bg-red-950/10 rounded-xl flex items-center gap-4 transition-all duration-200 group cursor-pointer"
          >
            <div className="bg-zinc-850 group-hover:bg-red-500/10 p-2.5 rounded-lg text-zinc-400 group-hover:text-red-500 transition-colors">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="text-white text-sm font-medium group-hover:text-red-400 transition-colors">
                Log out of all devices
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">Revokes access everywhere (phones, laptops)</div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-sm font-medium transition-all duration-250 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
