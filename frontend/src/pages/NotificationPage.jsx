import React, { useEffect, useState } from 'react'
import { fetchNotifications } from '../api/notification.api'
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react'

const TYPE_CONFIG = {
    'follow-request': {
        label: 'sent you a follow request',
        icon: UserPlus,
        color: 'bg-violet-500',
    },
    'like': {
        label: 'liked your photo',
        icon: Heart,
        color: 'bg-pink-500',
    },
    'comment': {
        label: 'commented on your post',
        icon: MessageCircle,
        color: 'bg-blue-500',
    },
}

const getTypeConfig = (type) =>
    TYPE_CONFIG[type] || { label: 'New notification', icon: Bell, color: 'bg-white/20' }

const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'now'
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    const days = Math.floor(hrs / 24)
    if (days === 1) return 'Yesterday'
    return `${days}d`
}

const Avatar = ({ sender, type }) => {
    const { icon: Icon, color } = getTypeConfig(type)
    return (
        <div className='relative flex-shrink-0'>
            <img
                src={
                    sender.profileImage ||
                    `https://ui-avatars.com/api/?name=${sender.username}&background=333&color=fff&size=80`
                }
                alt={sender.username}
                className='h-10 w-10 rounded-full object-cover block'
            />
            <div className={`absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] rounded-full ${color} flex items-center justify-center border-2 border-black`}>
                <Icon size={9} className='text-white' />
            </div>
        </div>
    )
}

const NotificationItem = ({ notification, isRead, onAccept, onDecline }) => {
    const { label } = getTypeConfig(notification.type)

    return (
        <div className={`flex items-start gap-3 px-2.5 py-3 rounded-xl transition-colors duration-150 ${!isRead ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}>
            <Avatar sender={notification.sender} type={notification.type} />

            <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between gap-2'>
                    <p className={`text-sm leading-snug ${isRead ? 'text-white/50' : 'text-white/85'}`}>
                        <span className={`font-medium ${isRead ? 'text-white/65' : 'text-white'}`}>
                            {notification.sender.username}
                        </span>
                        {' '}{notification.message || label}
                    </p>
                    <span className='text-[11px] text-white/25 whitespace-nowrap mt-0.5 flex-shrink-0'>
                        {formatTime(notification.createdAt)}
                    </span>
                </div>

                {notification.type === 'follow-request' && (
                    <div className='flex items-center gap-1.5 mt-2.5'>
                        <button
                            onClick={() => onAccept(notification._id)}
                            className='bg-white text-black text-xs font-medium px-3.5 py-1.5 rounded-full transition active:scale-95'
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => onDecline(notification._id)}
                            className='bg-white/8 hover:bg-white/12 text-white/60 text-xs font-medium px-3.5 py-1.5 rounded-full transition'
                        >
                            Decline
                        </button>
                    </div>
                )}
            </div>

            {!isRead && (
                <div className='h-1.5 w-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0' />
            )}
        </div>
    )
}

const Divider = () => (
    <div className='h-px bg-white/[0.05] mx-2.5' />
)

const groupNotifications = (notifications) => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000
    const newItems = notifications.filter(n => new Date(n.createdAt).getTime() > cutoff)
    const earlier = notifications.filter(n => new Date(n.createdAt).getTime() <= cutoff)
    return { newItems, earlier }
}

const NotificationPage = () => {
    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true)
                const res = await fetchNotifications()
                setNotifications(res.data.notifications)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        loadNotifications()
    }, [])

    const handleAccept = (id) => {
        // TODO: call accept API
        setNotifications(prev => prev.filter(n => n._id !== id))
    }

    const handleDecline = (id) => {
        // TODO: call decline API
        setNotifications(prev => prev.filter(n => n._id !== id))
    }

    const handleMarkAllRead = () => {
        // TODO: call mark-all-read API
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    }

    const { newItems, earlier } = groupNotifications(notifications)
    const hasUnread = notifications.some(n => !n.isRead)

    return (
        <div className='min-h-screen bg-black text-white pb-24'>

            {/* Header */}
            <div className='sticky top-[0px] z-20 backdrop-blur-xl bg-black/80 border-b border-white/[0.07]'>
                <div className='max-w-[470px] mx-auto px-5 h-[52px] flex items-center justify-between'>
                    <div className='flex items-center gap-2.5'>
                        <Bell size={18} className='text-white/60' />
                        <h1 className='text-[16px] font-medium tracking-[-0.2px]'>
                            Notifications
                        </h1>
                    </div>
                    {hasUnread && (
                        <button
                            onClick={handleMarkAllRead}
                            className='text-[12px] text-white/40 hover:text-white/70 transition'
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className='max-w-[470px] mx-auto px-3 py-2'>

                {loading ? (
                    <div className='flex items-center justify-center py-16'>
                        <div className='h-6 w-6 rounded-full border-2 border-white/10 border-t-white/60 animate-spin' />
                    </div>

                ) : notifications.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-24 text-center'>
                        <div className='h-14 w-14 rounded-full bg-white/[0.04] flex items-center justify-center mb-4'>
                            <Bell size={22} className='text-white/20' />
                        </div>
                        <h2 className='text-[15px] font-medium text-white/60'>
                            No notifications yet
                        </h2>
                        <p className='text-[13px] text-white/30 mt-1 max-w-[200px] leading-relaxed'>
                            When someone interacts with you, it'll appear here.
                        </p>
                    </div>

                ) : (
                    <div>
                        {newItems.length > 0 && (
                            <div className='mb-1'>
                                <p className='text-[11px] text-white/30 uppercase tracking-[0.6px] px-2.5 pt-3 pb-2'>
                                    New
                                </p>
                                <div>
                                    {newItems.map((notification, i) => (
                                        <React.Fragment key={notification._id}>
                                            <NotificationItem
                                                notification={notification}
                                                isRead={notification.isRead}
                                                onAccept={handleAccept}
                                                onDecline={handleDecline}
                                            />
                                            {i < newItems.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}

                        {earlier.length > 0 && (
                            <div>
                                <p className='text-[11px] text-white/30 uppercase tracking-[0.6px] px-2.5 pt-3 pb-2'>
                                    Earlier
                                </p>
                                <div>
                                    {earlier.map((notification, i) => (
                                        <React.Fragment key={notification._id}>
                                            <NotificationItem
                                                notification={notification}
                                                isRead={notification.isRead}
                                                onAccept={handleAccept}
                                                onDecline={handleDecline}
                                            />
                                            {i < earlier.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default NotificationPage