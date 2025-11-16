import React, { useState } from "react";
import { ImmersiveProvider } from "./components/ImmersiveMode";
import BottomBar from "./components/BottomBar";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePge from "./pages/HomePge";
import AddReel from "./pages/AddReel";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import ReelPage from "./pages/ReelPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { ReelsProvider } from "./context/ReelsContext";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "sonner";



const App = () => {
  const location = useLocation();
  const hideBottomBar = location.pathname === "/login";
  const [editProfileMenuToggle, setEditProfileMenuToggle] = useState(false);

  return (
    <ReelsProvider>


      <ImmersiveProvider>
      
          <Routes>

            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <ReelPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="chat"
              element={
                <ProtectedRoutes>
                  <HomePge />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoutes>
                  <SearchPage />
                </ProtectedRoutes>
              }
            />



            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <ProfilePage />
                </ProtectedRoutes>
              }
            />



            <Route
              path="/upload"
              element={
                <ProtectedRoutes>
                  <AddReel />
                </ProtectedRoutes>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
       

        {!hideBottomBar && (
          <div className="fixed bottom-0 w-full z-50">
            <BottomBar />
          </div>
        )}
      </ImmersiveProvider>
      <Toaster richColors position="top-right"/>
    </ReelsProvider>
    
  );
};

export default App;
