import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userProfilePage } from '../api/user.api'
import { followStatus, followUser, unfollowUser } from '../api/follow.api'

const tabs = ['Posts', 'Reels', 'Tagged']

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('Posts')
    const [hoveredPost, setHoveredPost] = useState(null)
    const [following, setFollowing] = useState(false)
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { username } = useParams()

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true)
            setError('')
            try {
                const res = await userProfilePage(username)
                setUser(res.data.user)
                setPosts(res.data.posts || [])
            } catch (err) {
                setError(err.response?.data?.message || 'User not found')
            } finally {
                setLoading(false)
            }
        }

        if (username) fetchUserProfile()
    }, [username])

    const handleFollowToggle = async () => {
        try {
            if (following) {
                await unfollowUser(user._id)
                setFollowing(false)
            } else {
                await followUser(user._id)
                setFollowing(true)
            }
        } catch (error) {
            console.error("Error updating follow status:", error)
        }
    }

    //Following Status Check
    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                const res = await followStatus(user._id)
                setFollowing(res.data.isFollowing)
            } catch (error) {
                console.error("Error checking follow status:", error)
            }
        }
        if (user) checkFollowingStatus()
    }, [user])


    if (loading) return (
        <div className="w-full flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                <span className="text-sm">Loading profile...</span>
            </div>
        </div>
    )

    if (error) return (
        <div className="w-full flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-5xl">🔍</div>
            <div className="font-semibold text-lg">User not found</div>
            <div className="text-sm text-gray-500">{error}</div>
        </div>
    )

    // filter posts that have an image (actual posts vs text-only)
    const imagePosts = posts.filter(post => post.image)

    return (
        <div className="w-full flex flex-col gap-7 max-w-4xl mx-auto px-5 pb-10 bg-white text-black font-sans">

            {/* Header */}
            <div className="flex items-start gap-8 mt-8 flex-wrap">

                {/* Avatar */}
                <div
                    className="rounded-full p-[3px] flex-shrink-0"
                    style={{
                        background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                        width: 150, height: 150
                    }}
                >
                    <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white">
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={`${user.username} profile`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl font-light text-gray-500">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-[220px]">

                    {/* Username + Buttons */}
                    {/* Username + Buttons */}
                    <div className="flex items-center gap-3 flex-wrap mb-4">
                        <span className="text-xl font-light">{user?.username}</span>
                        {/* <div className="flex gap-2">
                            {following && (
                                <button className="text-sm font-semibold px-4 py-[7px] rounded-lg bg-[#efefef] border border-[#dbdbdb] cursor-pointer">
                                    Message
                                </button>
                            )}
                            <button className="text-sm font-semibold px-3 py-[7px] rounded-lg bg-[#efefef] border border-[#dbdbdb] cursor-pointer">
                                ▾
                            </button>
                        </div> */}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mb-4 flex-wrap">
                        {[
                            [posts.length, 'posts'],
                            [user?.followersCount ?? 0, 'followers'],
                            [user?.followingCount ?? 0, 'following'],
                        ].map(([val, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-[17px] font-semibold">{val}</div>
                                <div className="text-[13px] text-gray-500">{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Bio */}
                    <div className="text-sm leading-relaxed">
                        {user?.fullName && (
                            <div className="font-semibold capitalize">{user.fullName}</div>
                        )}
                        {user?.bio && (
                            <div className="text-gray-700 whitespace-pre-line">{user.bio}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Follow Button */}
            {/* Follow / Message Button Row */}
            <div className="flex gap-2">
                <button
                    onClick={() => handleFollowToggle()}
                    className="text-sm flex-1 font-semibold px-4 py-[7px] rounded-lg cursor-pointer transition-colors"
                    style={{
                        background: following ? '#efefef' : '#0095f6',
                        color: following ? '#000' : '#fff',
                        border: following ? '1px solid #dbdbdb' : 'none'
                    }}
                >
                    {following ? 'Following' : 'Follow'}
                </button>

                {following && (
                    <button className="text-sm flex-1 font-semibold px-4 py-[7px] rounded-lg bg-[#efefef] border border-[#dbdbdb] cursor-pointer">
                        Message
                    </button>
                )}
            </div>

            {/* Tab Bar */}
            <div className="w-full flex border-t border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="flex-1 text-center py-3 text-[12px] font-semibold tracking-widest uppercase cursor-pointer transition-colors"
                        style={{
                            color: activeTab === tab ? '#000' : '#8e8e8e',
                            background: 'none',
                            border: 'none',
                            borderTop: activeTab === tab ? '1px solid #000' : '1px solid transparent',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Private account guard */}
            {user?.isPrivate && !following ? (
                <div className="text-center py-16 border-t border-gray-200">
                    <div className="text-5xl mb-4">🔒</div>
                    <div className="font-semibold text-lg mb-1">This account is private</div>
                    <div className="text-sm text-gray-500">
                        Follow this account to see their photos and videos.
                    </div>
                </div>

            ) : imagePosts.length === 0 ? (
                <div className="text-center py-16 border-t border-gray-200">
                    <div className="text-5xl mb-4">📷</div>
                    <div className="font-semibold text-lg mb-1">No posts yet</div>
                    <div className="text-sm text-gray-500">
                        When {user?.username} shares photos, you'll see them here.
                    </div>
                </div>

            ) : (
                <div className="w-full grid grid-cols-3 gap-[3px]">
                    {imagePosts.map(post => (
                        <div
                            key={post._id}
                            className="relative cursor-pointer"
                            style={{ aspectRatio: '1' }}
                            onMouseEnter={() => setHoveredPost(post._id)}
                            onMouseLeave={() => setHoveredPost(null)}
                        >
                            {/* post.image is the field in your schema */}
                            <img
                                src={post.image}
                                alt={post.text || 'post'}
                                className="w-full h-full object-cover"
                            />

                            {/* Hover overlay — no likesCount in schema, show text preview */}
                            {hoveredPost === post._id && (
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 text-white text-sm font-semibold px-3">
                                    {post.text && (
                                        <p className="text-center text-xs line-clamp-3 leading-relaxed">
                                            {post.text}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserProfilePage