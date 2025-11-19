import React,{ createContext, useContext, useEffect, useState } from "react";
import { verifyUser } from "../api/auth.api";


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        verifyUser()
            .then((res) => setUser(res.data.user))
            .catch(() => setUser(null))
    }, [])

    return(
        <AuthContext.Provider value={{user, setUser}}>
             {children}
        </AuthContext.Provider>
    )
}

export const useAuth =()=> useContext(AuthContext)