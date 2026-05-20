import React, { useState } from 'react'

const posts = [
    { id: 1, emoji: '🌅', bg: '#2a2a3a', likes: 843, comments: 32 },
    { id: 2, emoji: '🌲', bg: '#1a2a1a', likes: 1204, comments: 57, reel: true },
    { id: 3, emoji: '☀️', bg: '#3a2a1a', likes: 562, comments: 18 },
    { id: 4, emoji: '🎯', bg: '#1a1a3a', likes: 2100, comments: 94, reel: true },
    { id: 5, emoji: '🏙️', bg: '#2a1a2a', likes: 978, comments: 41 },
    { id: 6, emoji: '🌊', bg: '#1a2a2a', likes: 1543, comments: 73 },
    { id: 7, emoji: '🔥', bg: '#3a1a1a', likes: 3200, comments: 142, reel: true },
    { id: 8, emoji: '🌿', bg: '#1a3a2a', likes: 445, comments: 21 },
    { id: 9, emoji: '⭐', bg: '#2a2a1a', likes: 689, comments: 29 },
]

const highlights = [
    { emoji: '🇮🇳', label: 'Travel' },
    { emoji: '⚽', label: 'Sports' },
    { emoji: '🎮', label: 'Gaming' },
    { emoji: '🍕', label: 'Food' },
    { emoji: '💻', label: 'Code' },
]

const tabs = ['Posts', 'Reels', 'Tagged']

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('Posts')
    const [hoveredPost, setHoveredPost] = useState(null)
    const [following, setFollowing] = useState(false)

    return (
            <div className="w-full flex flex-col gap-7 max-w-4xl mx-auto px-5  pb-0 bg-white text-black font-sans">

            {/* Header */}
            <div className="flex items-start gap-8 mb-6 flex-wrap">

                {/* Avatar */}
                <div
                    className="rounded-full p-[3px] flex-shrink-0"
                    style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', width: 150, height: 150 }}
                >
                    <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white">
                        <img
                            src="https://imgs.search.brave.com/EKKYeZmGXbbdpm0vz1aQEhEqWkO08dfqpEBFrlOFsS4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/dWhkcGFwZXIuY29t/L3dhbGxwYXBlci9z/YXRvcnUtZ29qby1q/amstc3VuZ2xhc3Nl/cy0zMzJANUBt"
                            alt="Abhishek profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-[220px]">

                    {/* Username + Buttons */}
                    <div className="flex items-center gap-3 flex-wrap mb-4">
                        <span className="text-xl font-light">abhishek._dev</span>
                        <div className="flex gap-2">

                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mb-4 flex-wrap">
                        {[['142', 'posts'], ['24.8K', 'followers'], ['389', 'following']].map(([val, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-[17px] font-semibold">{val}</div>
                                <div className="text-[13px] text-gray-500">{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Bio */}
                    <div className="text-sm leading-relaxed">
                        <div className="font-semibold">Abhishek Sharma</div>
                        <div className="text-gray-500">💻 Full-stack dev · UI/UX nerd</div>
                        <div>Building things that matter ✨</div>
                        <a href="#" className="text-[#0095f6]">linktr.ee/abhishek.dev</a>
                        <div className="text-gray-500 text-[13px] mt-1">
                            Followed by <span className="text-black font-semibold">rahul_xo</span> and{' '}
                            <span className="text-black font-semibold">priya.codes</span> + 12 more
                        </div>
                    </div>
                </div>

            </div>

            <div>
                <button
                    onClick={() => setFollowing(!following)}
                    className="text-sm w-full font-semibold px-4 py-[7px] rounded-lg cursor-pointer"
                    style={{ background: following ? '#efefef' : '#0095f6', color: following ? '#000' : '#fff', border: following ? '1px solid #dbdbdb' : 'none' }}
                >
                    {following ? 'Following' : 'Follow'}
                </button>   
            </div>


            {/* Story Highlights */}
            <div className="w-full flex gap-4 overflow-x-auto pb-2 mb-1">
                <div className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0">
                    <div
                        className="w-[66px] h-[66px] rounded-full flex items-center justify-center text-white text-2xl border border-gray-200"
                        style={{ background: 'linear-gradient(135deg, #0095f6, #00c2cb)' }}
                    >
                        +
                    </div>
                    <span className="text-[11px] text-gray-500">New</span>
                </div>

                {highlights.map(({ emoji, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0">
                        <div className="w-[66px] h-[66px] rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-2xl">
                            {emoji}
                        </div>
                        <span className="text-[11px] text-gray-500 max-w-[72px] truncate text-center">{label}</span>
                    </div>
                ))}
            </div>

            {/* Tab Bar */}
            <div className="w-full flex border-t border-gray-200 mt-4">
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

            {/* Post Grid */}
            <div className="w-full grid grid-cols-3 gap-[3px] mt-[3px]">
                {posts.map(post => (
                    <div
                        key={post.id}
                        className="relative cursor-pointer"
                        style={{ aspectRatio: '1' }}
                        onMouseEnter={() => setHoveredPost(post.id)}
                        onMouseLeave={() => setHoveredPost(null)}
                    >
                        <div
                            className="w-full h-full flex items-center justify-center text-5xl"
                            style={{ background: post.bg }}
                        >
                            {post.emoji}
                        </div>

                        {post.reel && (
                            <div className="absolute top-2 right-2 text-white text-base">⧉</div>
                        )}

                        {hoveredPost === post.id && (
                            <div className="absolute inset-0 bg-black/35 flex items-center justify-center gap-4 text-white text-sm font-semibold">
                                <span>♥ {post.likes.toLocaleString()}</span>
                                <span>💬 {post.comments}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default UserProfilePage