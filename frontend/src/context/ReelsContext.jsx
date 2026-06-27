import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { getAllReels } from '../api/reels.api';
import { useAuth } from './AuthContext';

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
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: authLoading } = useAuth()

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

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // ✅ Fetch reels only once and shuffle them
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (reels.length > 0) return;

    const fetchReels = async () => {
      setIsLoading(true);

      try {
        const res = await getAllReels();
        setReels(shuffleArray(res.data.allReels));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReels();
  }, [user, authLoading]);

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
    isLoading,
    shuffleArray,
  };

  return (
    <ReelsContext.Provider value={value}>
      {children}
    </ReelsContext.Provider>
  );
};