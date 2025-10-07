<<<<<<< Updated upstream
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
=======
import { io, Socket } from "socket.io-client";

const BASE_URL = process.env.NEXT_PUBLIC_WS_URL;

export const initSocket = () => {
  return io(BASE_URL);
};

export const disconnectSocket = (io: Socket) => {
  if (!io.disconnected) {
    io.disconnect();
  }
};

export const connectSocket = (io: Socket) => {
  if (!io.connected) {
    io.connect();
  }
};
>>>>>>> Stashed changes
