import React,{ createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        if (!token) return;

        const newSocket = io("http://localhost:4000", {
            auth: { token },
            transports: ["websocket"]
        })

        newSocket.on("connect", () => {
            console.log("Socket Connected:", newSocket.id)
        })

        newSocket.on("disconnect", () => {
            console.log("Socket diconnected")
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}