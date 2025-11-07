import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { getAllReels } from '../api/reels.api';

const ReelsContext = createContext();

export const useReels = () => {
  const context = useContext(ReelsContext);
  if (!context) {
    throw new Error('useReels must be used within ReelsProvider');
  }
  return context;
};

export const ReelsProvider = ({ children }) => {
  const [reels, setReels] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Persist viewedSet across navigation
  const getInitialViewedSet = () => {
    try {
      const stored = sessionStorage.getItem('viewedReels');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  const viewedSet = useRef(getInitialViewedSet());

  // ✅ Fetch reels only once
  useEffect(() => {
    if (reels.length === 0 && !isLoading) {
      setIsLoading(true);
      getAllReels()
        .then(res => {
          setReels(res.data.allReels);
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const updateReelViews = (reelId) => {
    setReels((prev) =>
      prev.map((r) =>
        r._id === reelId
          ? { ...r, views: (r.views || 0) + 1 }
          : r
      )
    );
  };

  const markAsViewed = (reelId) => {
    if (!viewedSet.current.has(reelId)) {
      viewedSet.current.add(reelId);
      try {
        sessionStorage.setItem(
          'viewedReels',
          JSON.stringify([...viewedSet.current])
        );
      } catch (err) {
        console.error("Failed to save to sessionStorage:", err);
      }
      return true; // Indicates it's a new view
    }
    return false; // Already viewed
  };

  const value = {
    reels,
    setReels,
    scrollPosition,
    setScrollPosition,
    isMuted,
    setIsMuted,
    viewedSet: viewedSet.current,
    markAsViewed,
    updateReelViews,
    isLoading
  };

  return (
    <ReelsContext.Provider value={value}>
      {children}
    </ReelsContext.Provider>
  );
};