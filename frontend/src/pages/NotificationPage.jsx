import React, { useEffect, useState } from 'react'
import { fetchNotifications } from '../api/notification.api'
import { Bell, Check, X } from 'lucide-react'
import { acceptFollowRequest } from '../api/follow.api'

const NotificationPage = () => {

    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {

        const loadNotifications = async () => {
            try {
                setLoading(true)

                const res = await fetchNotifications()
                setNotifications(res.data.notifications)
                console.log(res.data.notifications)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        loadNotifications()

    }, [])

    const accpetUserFollowRequest = async(id)=>{
        try {
            const res = await acceptFollowRequest(id)
            console.log(res)
        } catch (error) {
            console.error(error)   
        }
    }

    return (
        <div className='min-h-screen bg-black text-white pb-24'>

            {/* Header */}
            <div className='sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-white/10'>
                <div className='max-w-[470px] mx-auto px-4 h-14 flex items-center gap-3'>
                    <Bell size={22} className='text-white/80' />
                    <h1 className='text-xl font-semibold tracking-tight'>
                        Notifications
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className='max-w-[470px] mx-auto px-3 py-4'>

                {loading ? (
                    <div className='flex items-center justify-center py-10'>
                        <div className='h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin' />
                    </div>
                ) : notifications.length === 0 ? (

                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <div className='h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4'>
                            <Bell size={28} className='text-white/40' />
                        </div>

                        <h2 className='text-lg font-medium text-white/90'>
                            No notifications yet
                        </h2>

                        <p className='text-sm text-white/40 mt-1'>
                            When someone interacts with you, it’ll appear here.
                        </p>
                    </div>

                ) : (

                    <div className='space-y-3'>

                        {notifications.map((notification) => (

                            <div
                                key={notification._id}
                                className='bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3 backdrop-blur-md'
                            >

                                <div className='flex items-start gap-3'>

                                    {/* Profile Image */}
                                    <img
                                        src={
                                            notification.sender.profileImage ||
                                            "https://ui-avatars.com/api/?name=" + notification.sender.username
                                        }
                                        alt="profile"
                                        className='h-12 w-12 rounded-full object-cover border border-white/10'
                                    />

                                    {/* Content */}
                                    <div className='flex-1 min-w-0'>

                                        <div className='flex items-center justify-between gap-2'>

                                            <div>
                                                <h3 className='font-semibold text-[15px] truncate'>
                                                    {notification.sender.username}
                                                </h3>

                                                <p className='text-sm text-white/55 mt-0.5'>
                                                    {notification.type === "follow-request"
                                                        ? "sent you a follow request"
                                                        : "New notification"}
                                                </p>
                                            </div>

                                            {!notification.isRead && (
                                                <div className='h-2.5 w-2.5 rounded-full bg-blue-500 mt-1 shrink-0' />
                                            )}

                                        </div>

                                        {/* Actions */}
                                        {notification.type === "follow-request" && (

                                            <div className='flex items-center gap-2 mt-3'>

                                                <button
                                                onClick={()=> accpetUserFollowRequest(notification.followRequest._id)}
                                                    className='flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-full text-sm font-medium active:scale-95 transition'
                                                >
                                                    <Check size={16} />
                                                    Accept
                                                </button>

                                                <button
                                                    className='flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-full text-sm font-medium transition'
                                                >
                                                    <X size={16} />
                                                    Decline
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    )
}

export default NotificationPage