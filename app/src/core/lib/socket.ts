import {io, Socket} from "socket.io-client"


export const initSocket = () => {
    return io()
}


export const disconnectSocket = (io: Socket) => {
    if(!io.disconnected){
        io.disconnect()
    }
}


export const connectSocket = (io: Socket) => {
    if(!io.connected){
        io.connect()
    }
}