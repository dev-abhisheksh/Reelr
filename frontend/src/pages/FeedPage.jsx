import React, { useEffect, useState, useRef, useCallback } from 'react'
import { fetchFeedPosts } from '../api/post.api'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ImageOff } from 'lucide-react'

const FeedPage = () => {
    const [feedPosts, setFeedPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState(new Set())
    const [savedPosts, setSavedPosts] = useState(new Set())
    const [doubleTapId, setDoubleTapId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expandedCaptions, setExpandedCaptions] = useState(new Set())

    useEffect(() => {
        const fetchAllFeeds = async () => {
            try {
                setLoading(true)
                const res = await fetchFeedPosts()
                setFeedPosts(res.data.posts)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchAllFeeds()
    }, [])

    const toggleLike = (postId) => {
        setLikedPosts(prev => {
            const next = new Set(prev)
            next.has(postId) ? next.delete(postId) : next.add(postId)
            return next
        })
    }

    const toggleSave = (postId) => {
        setSavedPosts(prev => {
            const next = new Set(prev)
            next.has(postId) ? next.delete(postId) : next.add(postId)
            return next
        })
    }

    const toggleCaption = (postId) => {
        setExpandedCaptions(prev => {
            const next = new Set(prev)
            next.has(postId) ? next.delete(postId) : next.add(postId)
            return next
        })
    }

    const handleDoubleTap = (postId) => {
        if (!likedPosts.has(postId)) {
            toggleLike(postId)
        }
        setDoubleTapId(postId)
        setTimeout(() => setDoubleTapId(null), 800)
    }

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'Just now'
        if (mins < 60) return `${mins}m`
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return `${hrs}h`
        const days = Math.floor(hrs / 24)
        if (days < 7) return `${days}d`
        const weeks = Math.floor(days / 7)
        if (weeks < 5) return `${weeks}w`
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Skeleton loader
    const PostSkeleton = () => (
        <div className="animate-pulse">
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-neutral-800" />
                <div className="h-3 w-24 bg-neutral-800 rounded" />
            </div>
            <div className="w-full aspect-square bg-neutral-800" />
            <div className="px-4 py-3 space-y-2">
                <div className="h-3 w-20 bg-neutral-800 rounded" />
                <div className="h-3 w-48 bg-neutral-800 rounded" />
            </div>
        </div>
    )

    if (loading) {
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

    return (
        <div className="min-h-screen bg-black pb-20">

            {/* ─── Top Navbar ─── */}
            <div className="fixed top-0 w-full z-30 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
                <div className="max-w-[470px] mx-auto h-[52px] flex items-center justify-between px-4">
                    <h1 className="text-[22px] font-bold tracking-tight bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Reelr
                    </h1>
                    <div className="flex items-center gap-5">
                        <Heart size={24} className="text-white/80 hover:text-white cursor-pointer transition-colors" />
                        <Send size={22} className="text-white/80 hover:text-white cursor-pointer transition-colors -rotate-12" />
                    </div>
                </div>
            </div>

            {/* ─── Stories bar placeholder ─── */}
            <div className="pt-[52px]">
                <div className="max-w-[470px] mx-auto border-b border-white/[0.06]">
                    <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
                        {feedPosts.slice(0, 8).map((post, idx) => (
                            <div key={`story-${idx}`} className="flex flex-col items-center gap-1 shrink-0">
                                <div className="w-[62px] h-[62px] rounded-full p-[2px] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
                                    <div className="w-full h-full rounded-full p-[2px] bg-black">
                                        <img
                                            src={post.userId?.profileImage}
                                            alt=""
                                            className="w-full h-full rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${post.userId?.username || 'U'}&background=333&color=fff&size=62`
                                            }}
                                        />
                                    </div>
                                </div>
                                <span className="text-[11px] text-neutral-400 max-w-[64px] truncate">
                                    {post.userId?.username}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Feed Posts ─── */}
            <div className="max-w-[470px] mx-auto">

                {feedPosts.length === 0 && !loading && (
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
                    <article key={post._id} className="border-b border-white/[0.06]">

                        {/* ── Post Header ── */}
                        <div className="flex items-center justify-between px-3.5 py-2.5">
                            <div className="flex items-center gap-3">
                                <div className="w-[34px] h-[34px] rounded-full ring-[1.5px] ring-neutral-700 overflow-hidden">
                                    <img
                                        src={post.userId?.profileImage}
                                        className="w-full h-full object-cover"
                                        alt=""
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${post.userId?.username || 'U'}&background=333&color=fff&size=34`
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[13px] font-semibold text-white">
                                        {post.userId?.username}
                                    </span>
                                    <span className="text-neutral-500 text-[13px]">•</span>
                                    <span className="text-neutral-500 text-[13px]">
                                        {timeAgo(post.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <button className="p-1 hover:bg-white/5 rounded-full transition-colors">
                                <MoreHorizontal size={20} className="text-neutral-400" />
                            </button>
                        </div>

                        {/* ── Post Image ── */}
                        {post.image && (
                            <div
                                className="relative w-full bg-neutral-950 select-none"
                                onDoubleClick={() => handleDoubleTap(post._id)}
                            >
                                <img
                                    src={post.image}
                                    className="w-full max-h-[585px] object-cover"
                                    alt="post"
                                    loading="lazy"
                                />

                                {/* Double-tap heart animation */}
                                {doubleTapId === post._id && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <Heart
                                            size={80}
                                            fill="white"
                                            className="text-white drop-shadow-2xl animate-[heartPop_0.8s_ease-out_forwards]"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Action Buttons ── */}
                        <div className="flex items-center justify-between px-3.5 pt-3 pb-1.5">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleLike(post._id)}
                                    className="active:scale-[1.2] transition-transform duration-150"
                                    aria-label="Like"
                                >
                                    <Heart
                                        size={24}
                                        fill={likedPosts.has(post._id) ? '#ff3040' : 'none'}
                                        className={`transition-colors duration-200 ${likedPosts.has(post._id) ? 'text-[#ff3040]' : 'text-white hover:text-neutral-400'
                                            }`}
                                    />
                                </button>
                                <button
                                    className="hover:text-neutral-400 transition-colors"
                                    aria-label="Comment"
                                >
                                    <MessageCircle size={24} className="text-white" />
                                </button>
                                <button
                                    className="hover:text-neutral-400 transition-colors"
                                    aria-label="Share"
                                >
                                    <Send size={22} className="text-white -rotate-12" />
                                </button>
                            </div>
                            <button
                                onClick={() => toggleSave(post._id)}
                                className="active:scale-[1.2] transition-transform duration-150"
                                aria-label="Save"
                            >
                                <Bookmark
                                    size={24}
                                    fill={savedPosts.has(post._id) ? 'white' : 'none'}
                                    className={`transition-colors duration-200 ${savedPosts.has(post._id) ? 'text-white' : 'text-white hover:text-neutral-400'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* ── Likes count ── */}
                        <div className="px-3.5 pb-1">
                            <p className="text-[13px] font-semibold text-white">
                                {(post.likesCount ?? 0) + (likedPosts.has(post._id) ? 1 : 0)} likes
                            </p>
                        </div>

                        {/* ── Caption ── */}
                        {post.text && (
                            <div className="px-3.5 pb-1">
                                <p className="text-[13px] text-white leading-[18px]">
                                    <span className="font-semibold mr-1.5">
                                        {post.userId?.username}
                                    </span>
                                    {post.text.length > 100 && !expandedCaptions.has(post._id) ? (
                                        <>
                                            {post.text.slice(0, 100)}...
                                            <button
                                                onClick={() => toggleCaption(post._id)}
                                                className="text-neutral-500 ml-1"
                                            >
                                                more
                                            </button>
                                        </>
                                    ) : (
                                        post.text
                                    )}
                                </p>
                            </div>
                        )}

                        {/* ── Timestamp ── */}
                        <div className="px-3.5 pt-1 pb-3">
                            <time className="text-[11px] text-neutral-500 uppercase tracking-wider">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: new Date(post.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                })}
                            </time>
                        </div>

                    </article>
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

export default FeedPage