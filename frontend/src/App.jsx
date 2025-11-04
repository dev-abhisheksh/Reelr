import React from 'react'
import { ImmersiveProvider } from './components/ImmersiveMode'
import BottomBar from './components/BottomBar'
import ReelPage from './pages/ReelPage'
import { Route, Routes } from 'react-router-dom'
import HomePge from './pages/HomePge'
import AddReel from './pages/AddReel'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'

const App = () => {
  return (
    <ImmersiveProvider>
      <Routes>


        <Route path='/' element={
          <div className='flex flex-col justify-between h-screen'>
            <ReelPage />
            <div className='absolute bottom-3 w-full'>
              <BottomBar />
            </div>
          </div>
        } />

        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/home' element={<HomePge />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/upload' element={<AddReel />} />

      </Routes>

      <div className='fixed bottom-3 w-full z-50'>
        <BottomBar />
      </div>



    </ImmersiveProvider>
  )
}

export default App
