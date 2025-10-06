import { connectSocket, disconnectSocket, initSocket } from "@/core/lib/socket";
import { createContext, useEffect, useState } from "react";
import {Socket} from "socket.io-client"
interface SocketContextProps{
    io: Socket
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined)


export const SocketProvider = () => {
    const [io] = useState(()=> initSocket())
    
    useEffect(()=>{
        connectSocket(io)
        return(()=> disconnectSocket(io))
    }, [io])


    return(
        <SocketContext.Provider value={{io}}></SocketContext.Provider>
    )
}