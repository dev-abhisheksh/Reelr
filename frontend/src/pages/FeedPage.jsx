import React from 'react'
import { fetchFeedPosts } from '../api/post.api'
import { Send, ImageOff, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import StoriesBar from '../components/feed/StoriesBar'
import PostSkeleton from '../components/feed/PostSkeleton'
import FeedPostCard from '../components/feed/FeedPostCard'

const FeedPage = () => {
    const navigate = useNavigate()

    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["feed"],
        queryFn: fetchFeedPosts,
        staleTime: 5 * 60 * 1000,
    });

    const feedPosts = data?.data?.posts || [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black">
                <div className="fixed top-0 w-full z-30 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
                    <div className="max-w-[470px] mx-auto h-[52px] flex items-center justify-center px-4">
                        <h1 className="text-[22px] font-bold tracking-tight bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                            Reelr
                        </h1>
                    </div>
                </div>
                <div className="pt-[52px] max-w-[470px] mx-auto">
                    {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
                </div>
            </div>
        )
    }

    if (error) {
        return <div>Error loading feed</div>;
    }

    return (
        <div className="min-h-screen bg-black pb-20">

            {/* ─── Top Navbar ─── */}
            <div className="fixed top-0 w-full z-30 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
                <div className="max-w-[470px] mx-auto h-[52px] flex items-center justify-between px-4">
                    <h1 className="text-[22px] font-bold tracking-tight bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Reelr
                    </h1>
                    <div className="flex items-center gap-5">
                        <Bell onClick={() => navigate("/notifications")} size={24} className="text-white/80 hover:text-white cursor-pointer transition-colors" />
                        <Send onClick={() => navigate("/chat")} size={22} className="text-white/80 hover:text-white cursor-pointer transition-colors -rotate-12" />
                    </div>
                </div>
            </div>

            {/* ─── Stories bar placeholder ─── */}
            <StoriesBar feedPosts={feedPosts} />

            {/* ─── Feed Posts ─── */}
            <div className="max-w-[470px] mx-auto">

                {feedPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center mb-5">
                            <ImageOff size={32} className="text-neutral-600" />
                        </div>
                        <h2 className="text-white text-lg font-semibold mb-1">No posts yet</h2>
                        <p className="text-neutral-500 text-sm">
                            Follow people to see their posts here.
                        </p>
                    </div>
                )}

                {feedPosts.map((post) => (
                    <FeedPostCard key={post._id} post={post} />
                ))}
            </div>

            {/* ─── Inline keyframe styles ─── */}
            <style>{`
                @keyframes heartPop {
                    0% { transform: scale(0); opacity: 0; }
                    15% { transform: scale(1.2); opacity: 1; }
                    30% { transform: scale(0.95); opacity: 1; }
                    45% { transform: scale(1.05); opacity: 1; }
                    80% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1); opacity: 0; }
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}

export default FeedPage;