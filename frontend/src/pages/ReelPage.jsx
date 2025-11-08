import React, { useEffect, useRef } from 'react'
import { incrementReelView } from '../api/reels.api'
import { AiFillEye } from "react-icons/ai";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import ImmersiveMode from '../components/ImmersiveMode';
import { useImmersive } from '../components/ImmersiveMode'
import { useReels } from '../context/ReelsContext';

const HomePage = () => {
    const { 
        reels, 
        isMuted, 
        setIsMuted, 
        markAsViewed, 
        updateReelViews,
        scrollPosition,
        setScrollPosition 
    } = useReels();
    
    const videoRefs = useRef([])
    const containerRef = useRef(null);
    const { isImmersive } = useImmersive();

    // ✅ Restore scroll position when returning to page
    useEffect(() => {
        if (containerRef.current && scrollPosition > 0) {
            containerRef.current.scrollTop = scrollPosition;
        }
    }, []);

    // ✅ Save scroll position before unmounting
    useEffect(() => {
        const container = containerRef.current;
        
        const handleScroll = () => {
            if (container) {
                setScrollPosition(container.scrollTop);
            }
        };

        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [setScrollPosition]);

    // ✅ Auto play + view increment logic
    useEffect(() => {
        if (!reels.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                const index = videoRefs.current.indexOf(video);

                if (entry.isIntersecting) {
                    video.play();
                    const reel = reels[index];

                    if (reel && markAsViewed(reel._id)) {
                        incrementReelView(reel._id)
                            .then(() => {
                                updateReelViews(reel._id);
                            })
                            .catch(err => console.error("Failed to increment view:", err));
                    }
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.6 });

        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach((video) => {
                if (video) observer.unobserve(video);
            });
            observer.disconnect();
        };

    }, [reels.length, markAsViewed, updateReelViews]);

    // ✅ Global mute/unmute
    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);

        videoRefs.current.forEach(video => {
            if (video) video.muted = newState;
        });
    };

    return (
        <div 
            ref={containerRef}
            className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory"
        >
            {reels.length > 0 ? (
                reels.map((reel, index) => (
                    <div
                        key={reel._id}
                        className="h-screen w-full flex justify-center items-center snap-start relative"
                    >
                        <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            src={reel.videoUrl}
                            className="h-full w-full object-cover"
                            loop
                            muted
                            playsInline
                            onClick={toggleMute}
                        />

                        <div className='absolute top-20 right-5'>
                            <ImmersiveMode />
                        </div>

                        {/* Side icons */}
                        <div className={`flex justify-center py-2 transition-all duration-300 ${isImmersive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <div className='absolute right-5 bottom-40'>
                                <div className='flex flex-col gap-4'>
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="h-8 w-8 flex justify-center items-center">
                                            <FaHeart className="text-red-500 text-[25px]" />
                                        </div>
                                        <p className="text-white font-bold text-xs">0</p>
                                    </div>

                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="h-8 w-8 flex justify-center items-center">
                                            <AiFillEye className="text-white text-[25px]" />
                                        </div>
                                        <p className="text-white font-bold text-xs">{reel.views ?? 0}</p>
                                    </div>

                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="h-8 w-8 flex justify-center items-center">
                                            <FaRegCommentDots className="text-white text-[23px]" />
                                        </div>
                                        <p className="text-white font-bold text-xs">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text overlay */}
                        <div className="absolute bottom-25 left-5 text-white">
                            <h1 className="text-lg font-semibold">@{reel.creator?.username}</h1>
                            <p className="text-sm opacity-80">{reel.description}</p>
                        </div>

                        {/* Mute indicator */}
                        <div className="absolute top-5 right-5 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                            {isMuted ? "🔇" : "🔊"}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-white text-center mt-10">No reels found</p>
            )}
        </div>
    );
};

export default HomePage;