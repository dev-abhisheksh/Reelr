import React from 'react'
import { HiHome } from "react-icons/hi2";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { MdAddCircleOutline, MdSlowMotionVideo } from "react-icons/md";
import { useImmersive } from './ImmersiveMode';
import { NavLink } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const BottomBar = () => {
    const { isImmersive } = useImmersive();

    const links = [
        { to: "/chat", icon: <MessageCircle size={25} /> },
        { to: "/upload", icon: <MdAddCircleOutline size={26} /> },
        { to: "/search", icon: <FaSearch size={20} /> },
        { to: "/", icon: <MdSlowMotionVideo size={26} /> },
        { to: "/profile", icon: <FaRegUserCircle /> }
    ]

    return (
        <div>

            <div className='w-full h-15 bg-[#282828] flex justify-center items-center'>
                <div className='backdrop:blur-md w-[95%] rounded-md flex justify-around items-center text-white text-2xl gap-4'>
                    {links.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.to}
                            className={({ isActive }) =>
                                `transition-all duration-200 ${isActive ? 'text-orange-500 scale-110' : 'text-white'
                                }`
                            }
                        >
                            {link.icon}
                        </NavLink>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default BottomBar
