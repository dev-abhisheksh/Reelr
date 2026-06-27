import React,{ createContext, useContext, useEffect, useState } from "react";
import { verifyUserIdentity } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const verifyUser = async () => {
        try {
            const res = await verifyUserIdentity()
            setUser(res.data.user)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        verifyUser()
    },[])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext)
}