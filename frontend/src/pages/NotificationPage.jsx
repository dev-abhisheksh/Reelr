import React, { useEffect } from 'react'
import { useNotification } from '../context/NotificationContext'
import { Heart, MessageCircle, UserPlus, Film, Bell, BellOff, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotificationPage = () => {
    const { notifications, unreadCount, markAllRead, fetchNotifications } = useNotification()
    const navigate = useNavigate()

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'Just now'
        if (mins < 60) return `${mins}m ago`
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return `${hrs}h ago`
        const days = Math.floor(hrs / 24)
        if (days < 7) return `${days}d ago`
        const weeks = Math.floor(days / 7)
        if (weeks < 5) return `${weeks}w ago`
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <Heart size={16} fill="#ff3040" className="text-[#ff3040]" />
            case 'comment':
                return <MessageCircle size={16} className="text-blue-400" />
            case 'follow-request':
                return <UserPlus size={16} className="text-green-400" />
            case 'post':
            default:
                return <Film size={16} className="text-orange-400" />
        }
    }

    const getNotificationText = (notification) => {
        switch (notification.type) {
            case 'like':
                return 'liked your post'
            case 'comment':
                return 'commented on your post'
            case 'follow-request':
                return 'sent you a follow request'
            case 'post':
            default:
                return 'shared a new post'
        }
    }

    // Group notifications: Today, This Week, Earlier
    const groupNotifications = (items) => {
        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        const weekStart = todayStart - 6 * 86400000

        const groups = { today: [], thisWeek: [], earlier: [] }

        items.forEach(n => {
            const ts = new Date(n.createdAt).getTime()
            if (ts >= todayStart) groups.today.push(n)
            else if (ts >= weekStart) groups.thisWeek.push(n)
            else groups.earlier.push(n)
        })

        return groups
    }

    const grouped = groupNotifications(notifications)

    const renderNotification = (notification) => (
        <div
            key={notification._id}
            className={`flex items-start gap-3 px-4 py-3.5 transition-colors duration-200 active:bg-white/5 cursor-pointer ${!notification.isRead ? 'bg-white/[0.03]' : ''
                }`}
            onClick={() => {
                if (notification.postId?._id) {
                    navigate(`/post/${notification.postId._id}`)
                }
            }}
        >
            {/* Avatar with type badge */}
            <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-full overflow-hidden ring-1 ${!notification.isRead ? 'ring-orange-500/50' : 'ring-neutral-700/50'}`}>
                    <img
                        src={notification.sender?.profileImage}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${notification.sender?.username || 'U'}&background=333&color=fff&size=44`
                        }}
                    />
                </div>
                {/* Type icon badge */}
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[13px] leading-[18px] text-neutral-300">
                    <span className="font-semibold text-white">
                        {notification.sender?.username || 'Someone'}
                    </span>
                    {' '}{getNotificationText(notification)}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                    {timeAgo(notification.createdAt)}
                </p>
            </div>

            {/* Post thumbnail */}
            {notification.postId?.image && (
                <div className="w-11 h-11 rounded-md overflow-hidden shrink-0 bg-neutral-800">
                    <img
                        src={notification.postId.image}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Unread dot */}
            {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2 ml-1" />
            )}
        </div>
    )

    const renderSection = (title, items) => {
        if (items.length === 0) return null
        return (
            <div>
                <div className="px-4 pt-4 pb-2">
                    <h3 className="text-[14px] font-bold text-white">{title}</h3>
                </div>
                <div className="divide-y divide-white/[0.04]">
                    {items.map(renderNotification)}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black pb-20">

            {/* ─── Header ─── */}
            <div className="fixed top-0 w-full z-30 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
                <div className="max-w-[470px] mx-auto h-[52px] flex items-center justify-between px-4">
                    <h1 className="text-[20px] font-bold text-white tracking-tight">
                        Notifications
                    </h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-1.5 text-[13px] text-orange-400 font-semibold hover:text-orange-300 active:scale-95 transition-all"
                        >
                            <CheckCheck size={16} />
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Content ─── */}
            <div className="pt-[52px] max-w-[470px] mx-auto">

                {/* Unread count pill */}
                {unreadCount > 0 && (
                    <div className="px-4 pt-3 pb-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <Bell size={13} className="text-orange-400" />
                            <span className="text-[12px] font-semibold text-orange-400">
                                {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
                            <BellOff size={32} className="text-neutral-600" />
                        </div>
                        <h2 className="text-white text-lg font-semibold mb-1">No notifications yet</h2>
                        <p className="text-neutral-500 text-sm leading-relaxed max-w-[260px]">
                            When someone likes, comments, or shares a post, you'll see it here.
                        </p>
                    </div>
                )}

                {/* Grouped notifications */}
                {notifications.length > 0 && (
                    <div className="divide-y divide-white/[0.06]">
                        {renderSection('Today', grouped.today)}
                        {renderSection('This Week', grouped.thisWeek)}
                        {renderSection('Earlier', grouped.earlier)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationPage
