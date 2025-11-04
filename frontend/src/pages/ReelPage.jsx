import React, { useEffect, useState, useRef } from 'react'
import { getAllReels, incrementReelView } from '../api/reels.api'
import { AiFillEye } from "react-icons/ai";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import ImmersiveMode from '../components/ImmersiveMode';
import { useImmersive } from '../components/ImmersiveMode'


const HomePage = () => {
    const [reels, setReels] = useState([])
    const videoRefs = useRef([])
    const [unmutedIndex, setUnmutedIndex] = useState(null)
     const { isImmersive } = useImmersive();

    // ✅ Initialize viewedSet from sessionStorage - correct way
    const getInitialViewedSet = () => {
        try {
            const stored = sessionStorage.getItem('viewedReels');
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
            return new Set();
        }
    };

    const viewedSet = useRef(getInitialViewedSet());

    useEffect(() => {
        getAllReels()
            .then(res => {
                console.log(res.data.allReels);
                setReels(res.data.allReels);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!reels.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                const index = videoRefs.current.indexOf(video);

                if (entry.isIntersecting) {
                    video.play();

                    const reel = reels[index];

                    if (reel && !viewedSet.current.has(reel._id)) {
                        viewedSet.current.add(reel._id);

                        // ✅ Save to sessionStorage
                        try {
                            sessionStorage.setItem(
                                'viewedReels',
                                JSON.stringify([...viewedSet.current])
                            );
                        } catch (err) {
                            console.error("Failed to save to sessionStorage:", err);
                        }

                        incrementReelView(reel._id)
                            .then(() => {
                                setReels((prev) =>
                                    prev.map((r) =>
                                        r._id === reel._id ? { ...r, views: (r.views || 0) + 1 } : r
                                    )
                                );
                                console.log("✅ View incremented:", reel.title);
                            })
                            .catch((err) =>
                                console.error("❌ Failed to increment view:", err)
                            );
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

    }, [reels.length]);

    const toggleMute = (index) => {
        const video = videoRefs.current[index]
        if (video) {
            video.muted = !video.muted
            setUnmutedIndex(video.muted ? null : index)
        }
    }

    return (
        <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory">
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
                            muted={unmutedIndex !== index}
                            playsInline
                            onClick={() => toggleMute(index)}
                        />

                        <div className='absolute top-20 right-5'>
                            <ImmersiveMode />
                        </div>

                        {/* Side icons */}
                        <div className={`flex justify-center py-2 transition-all duration-300 ${isImmersive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}>
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


                        {/* Overlay info */}
                        <div className="absolute bottom-25 left-5 text-white">
                            <h1 className="text-lg font-semibold">@{reel.creator?.username}</h1>
                            <p className="text-sm opacity-80">{reel.description}</p>
                        </div>

                        {/* Mute/Unmute indicator */}
                        <div className="absolute top-5 right-5 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                            {unmutedIndex === index ? "🔊" : "🔇"}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-white text-center mt-10">No reels found</p>
            )}
        </div>
    )
}

export default HomePage