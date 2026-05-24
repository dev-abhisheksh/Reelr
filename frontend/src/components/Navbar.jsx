import { Bell, Send } from 'lucide-react'
import React from 'react'

const Navbar = () => {
    return (
        <div className='mb-10'>
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
        </div>
    )
}

export default Navbar