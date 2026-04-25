import React, { useEffect, useState } from 'react'
import { fetchFeedPosts } from '../api/post.api'

const FeedPage = () => {
    const [feedPosts, setFeedPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState(new Set())

    useEffect(() => {
        const fetchAllFeeds = async () => {
            try {
                const res = await fetchFeedPosts()
                setFeedPosts(res.data.posts)
            } catch (error) {
                console.error(error)
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

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <div className="fixed top-0 w-full bg-white border-b border-gray-200 z-10 h-14 flex items-center justify-center">
                <span className="text-xl font-semibold tracking-tight">Status will be displayed here</span>
            </div>

            {/* Feed */}
            <div className="pt-14 max-w-[470px] mx-auto flex flex-col gap-4 pb-10">
                {feedPosts.map((post) => (
                    <div key={post._id} className="bg-white border border-gray-200">

                        {/* Header */}
                        <div className="flex items-center gap-3 px-3 py-2">
                            <img
                                src={post.userId.profileImage}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                alt=""
                            />
                            <span className="text-sm font-semibold">{post.userId.username}</span>
                        </div>

                        {/* Image */}
                        <img
                            src={post.image}
                            className="w-full aspect-square object-cover"
                            alt=""
                        />

                        {/* Actions */}
                        <div className="flex items-center gap-4 px-3 pt-3 pb-1">
                            <button onClick={() => toggleLike(post._id)} className="text-2xl leading-none">
                                {likedPosts.has(post._id) ? '❤️' : '🤍'}
                            </button>
                            <button className="text-2xl leading-none">💬</button>
                            <button className="text-2xl leading-none">📤</button>
                        </div>

                        {/* Likes */}
                        <div className="px-3 py-1 text-sm font-semibold">
                            {post.likesCount ?? 0} likes
                        </div>

                        {/* Caption */}
                        <div className="px-3 pb-2 text-sm">
                            <span className="font-semibold mr-1">{post.userId.username}</span>
                            {post.text}
                        </div>

                        {/* Time */}
                        <div className="px-3 pb-3 text-xs text-gray-400 uppercase tracking-wide">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default FeedPage