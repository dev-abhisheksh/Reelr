    import React, { useEffect, useState } from 'react'
    import { useParams } from 'react-router-dom'
    import { userProfilePage } from '../api/user.api'
    import {
        followStatus,
        followUser,
        unfollowUser
    } from '../api/follow.api'
    import { useQuery, useQueryClient } from '@tanstack/react-query'

    const tabs = ['Posts', 'Reels', 'Tagged']

    const UserProfilePage = () => {

        const [activeTab, setActiveTab] = useState('Posts')
        const [hoveredPost, setHoveredPost] = useState(null)

        // none | pending | accepted
        const [followStatusState, setFollowStatusState] = useState('none')

        const { username } = useParams()
        const queryClient = useQueryClient();

        const {
            data,
            isLoading,
            error,
        } = useQuery({
            queryKey: ["profile", username],
            queryFn: () => userProfilePage(username),
            enabled: !!username,
            staleTime: 5 * 60 * 1000,
        });

        const user = data?.data?.user;
        const posts = data?.data?.posts || [];

        // Check follow status
        useEffect(() => {

            if (!user?._id) return;

            const checkFollowingStatus = async () => {

                try {

                    const res = await followStatus(user._id)

                    setFollowStatusState(res.data.status)

                } catch (error) {
                    console.error(error)
                }
            }

            checkFollowingStatus();

            const interval = setInterval(() => {
                checkFollowingStatus();
            }, 5000);

            return () => clearInterval(interval);

        }, [user?._id]);

        // Follow / Unfollow
        const handleFollowToggle = async () => {

            try {

                // Unfollow
                if (followStatusState === "accepted") {

                    await unfollowUser(user._id)

                    setFollowStatusState("none")

                    queryClient.setQueryData(["profile", username], (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            data: {
                                ...old.data,
                                user: {
                                    ...old.data.user,
                                    followersCount: Math.max((old.data.user.followersCount || 1) - 1, 0)
                                }
                            }
                        }
                    });

                }

                // Cancel pending request
                else if (followStatusState === "pending") {

                    // calling followUser will cancel the pending request on the server
                    await followUser(user._id)

                    setFollowStatusState("none")

                }

                // Follow
                else if (followStatusState === "none") {

                    await followUser(user._id)

                    const newStatus = user?.isPrivate
                        ? "pending"
                        : "accepted"

                    setFollowStatusState(newStatus)

                    if (newStatus === "accepted") {

                        queryClient.setQueryData(["profile", username], (old) => {
                            if (!old) return old;
                            return {
                                ...old,
                                data: {
                                    ...old.data,
                                    user: {
                                        ...old.data.user,
                                        followersCount: (old.data.user.followersCount || 0) + 1
                                    }
                                }
                            }
                        });
                    }
                }

            } catch (error) {

                console.error(
                    "Error updating follow status:",
                    error.response?.data || error
                )
            }
        }

        // Loading
        if (isLoading) return (
            <div className="w-full min-h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4 text-zinc-400">
                    <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
                    <span className="text-sm tracking-wide">
                        Loading profile...
                    </span>
                </div>
            </div>
        )

        // Error
        if (error) return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black text-white gap-3">
                <div className="text-6xl">🔍</div>

                <div className="font-semibold text-xl">
                    User not found
                </div>

                <div className="text-sm text-zinc-400">
                    {error.response?.data?.message || error.message || 'User not found'}
                </div>
            </div>
        )

        const imagePosts = posts.filter(post => post.image)

        return (
            <div className="w-full min-h-screen flex flex-col gap-7 max-w-5xl mx-auto px-5 pb-12 bg-black text-white font-sans">

                {/* Header */}
                <div className="flex items-start gap-10 mt-8 flex-wrap bg-zinc-950 border border-zinc-800 rounded-3xl p-7 shadow-2xl">

                    {/* Avatar */}
                    <div
                        className="rounded-full p-[3px] flex-shrink-0"
                        style={{
                            background:
                                'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                            width: 150,
                            height: 150
                        }}
                    >

                        <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-black">

                            {user?.profileImage ? (

                                <img
                                    src={user.profileImage}
                                    alt={`${user.username} profile`}
                                    className="w-full h-full object-cover"
                                />

                            ) : (

                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-5xl font-light text-zinc-300">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-[220px]">

                        {/* Username */}
                        <div className="flex items-center gap-3 flex-wrap mb-5">

                            <span className="text-2xl font-semibold tracking-tight">
                                {user?.username}
                            </span>

                        </div>

                        {/* Stats */}
                        <div className="flex gap-10 mb-5 flex-wrap">

                            {[
                                [posts.length, 'posts'],
                                [user?.followersCount ?? 0, 'followers'],
                                [user?.followingCount ?? 0, 'following'],
                            ].map(([val, label]) => (

                                <div
                                    key={label}
                                    className="text-center hover:scale-105 transition-transform duration-200"
                                >

                                    <div className="text-[20px] font-bold">
                                        {val}
                                    </div>

                                    <div className="text-[13px] text-zinc-400 tracking-wide">
                                        {label}
                                    </div>

                                </div>
                            ))}

                        </div>

                        {/* Bio */}
                        <div className="text-sm leading-relaxed">

                            {user?.fullName && (
                                <div className="font-semibold capitalize mb-1">
                                    {user.fullName}
                                </div>
                            )}

                            {user?.bio && (
                                <div className="text-zinc-300 whitespace-pre-line leading-6">
                                    {user.bio}
                                </div>
                            )}

                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-6">

                            <button
                                onClick={handleFollowToggle}
                                className={`text-sm px-6 py-[9px] rounded-xl font-semibold transition-all duration-200 cursor-pointer ${followStatusState !== "none"
                                    ? 'bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800'
                                    : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'
                                    }`}
                            >

                                {
                                    followStatusState === "accepted"
                                        ? "Following"
                                        : followStatusState === "pending"
                                            ? "Requested"
                                            : "Follow"
                                }

                            </button>

                            {followStatusState === "accepted" && (

                                <button
                                    className="text-sm px-6 py-[9px] rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
                                >
                                    Message
                                </button>
                            )}

                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="w-full flex border-t border-zinc-800 mt-2">

                    {tabs.map(tab => (

                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="flex-1 text-center py-4 text-[12px] font-semibold tracking-[0.2em] uppercase cursor-pointer transition-all duration-200"
                            style={{
                                color:
                                    activeTab === tab
                                        ? '#fff'
                                        : '#71717a',

                                background: 'none',

                                border: 'none',

                                borderTop:
                                    activeTab === tab
                                        ? '1px solid #fff'
                                        : '1px solid transparent',
                            }}
                        >

                            {tab}

                        </button>
                    ))}
                </div>

                {/* Private Account */}
                {user?.isPrivate &&
                    followStatusState !== "accepted" ? (

                    <div className="text-center py-20 border-t border-zinc-800">

                        <div className="text-6xl mb-5">🔒</div>

                        <div className="font-semibold text-xl mb-2">
                            This account is private
                        </div>

                        <div className="text-sm text-zinc-400">
                            Follow this account to see their photos and videos.
                        </div>

                    </div>

                ) : imagePosts.length === 0 ? (

                    <div className="text-center py-20 border-t border-zinc-800">

                        <div className="text-6xl mb-5">📷</div>

                        <div className="font-semibold text-xl mb-2">
                            No posts yet
                        </div>

                        <div className="text-sm text-zinc-400">
                            When {user?.username} shares photos,
                            you'll see them here.
                        </div>

                    </div>

                ) : (

                    <div className="w-full grid grid-cols-3 gap-[4px]">

                        {imagePosts.map(post => (

                            <div
                                key={post._id}
                                className="relative cursor-pointer overflow-hidden rounded-sm bg-zinc-900"
                                style={{ aspectRatio: '1' }}
                                onMouseEnter={() => setHoveredPost(post._id)}
                                onMouseLeave={() => setHoveredPost(null)}
                            >

                                <img
                                    src={post.image}
                                    alt={post.text || 'post'}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />

                                {/* Hover Overlay */}
                                {hoveredPost === post._id && (

                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 text-white text-sm font-semibold px-3 transition-all duration-200">

                                        {post.text && (

                                            <p className="text-center text-xs line-clamp-3 leading-relaxed text-zinc-100">
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