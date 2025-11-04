import React from 'react'
import { HiHome } from "react-icons/hi2";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { MdAddCircleOutline, MdSlowMotionVideo } from "react-icons/md";
import { useImmersive } from './ImmersiveMode';
import { NavLink } from 'react-router-dom';

const BottomBar = () => {
    const { isImmersive } = useImmersive();

    const links = [
        { to: "/home", icon: <HiHome size={25} /> },
        { to: "/upload", icon: <MdAddCircleOutline size={26} /> },
        { to: "/search", icon: <FaSearch size={20} /> },
        { to: "/", icon: <MdSlowMotionVideo size={26} /> },
        { to: "/profile", icon: <FaRegUserCircle /> }
    ]

    return (
        <div
            className={`flex justify-center py-2 transition-all duration-300 ${isImmersive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className='backdrop:blur-md border border-white/20 shadow-lg bg-white/20 h-[3rem] w-[95%] rounded-md flex justify-around items-center text-white text-2xl gap-4'>
                {links.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.to}
                        className={({ isActive }) =>
                            `transition-all duration-200 ${isActive ? 'text-orange-500 scale-110' : 'text-white/70'
                            }`
                        }
                    >
                        {link.icon}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default BottomBar
