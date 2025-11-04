import React, { createContext, useContext, useState } from 'react'
import { BiExitFullscreen, BiFullscreen } from 'react-icons/bi'

// 1️⃣ Create context
const ImmersiveContext = createContext()

// 2️⃣ Provider
export const ImmersiveProvider = ({ children }) => {
  const [isImmersive, setIsImmersive] = useState(false)
  const toggleImmersive = () => setIsImmersive(prev => !prev)

  return (
    <ImmersiveContext.Provider value={{ isImmersive, toggleImmersive }}>
      {children}
    </ImmersiveContext.Provider>
  )
}

// 3️⃣ Custom hook
export const useImmersive = () => useContext(ImmersiveContext)

// 4️⃣ Toggle component
const ImmersiveMode = () => {
  const { isImmersive, toggleImmersive } = useImmersive()

  return (
    <div onClick={toggleImmersive} className='cursor-pointer'>
      {isImmersive ? (
        <BiExitFullscreen size={30} className='text-white' />
      ) : (
        <BiFullscreen size={30} className='text-white' />
      )}
    </div>
  )
}

export default ImmersiveMode
