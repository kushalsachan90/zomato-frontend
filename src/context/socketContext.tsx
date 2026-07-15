import {createContext,useContext,useEffect,useRef ,type ReactNode }from "react";
import { io,Socket } from "socket.io-client";
import { AppData } from "./AppContext"
import { RealtimeService as realtimeService } from "../main";
interface socketContextType{
    socket:Socket|null;
}  

const socketContext=createContext<socketContextType>({socket:null});

export const SocketProvider=({children}:{children:ReactNode})=>{
    const {isAuth}=AppData();
    const socketRef=useRef<Socket|null>(null);
    useEffect(()=>{
        if(!isAuth){
            socketRef.current?.disconnect();
            socketRef.current=null;
            return;
        }
        if(socketRef.current)return ;

        const socket =io(realtimeService,{
            auth:{
                token:localStorage.getItem("token")
            },
            transports:["websocket"]
        });
        console.log(socket,"socket")
        socketRef.current=socket;
        socket.on("connect",()=>{
            console.log("socket connect",socket.id);
        })
         socket.on("disconnect",()=>{
            console.log("socket disconnect",socket.id);
        })
        socket.on("connect_error",(err)=>{
            console.log("socket connect_error",err.message);
        })
        return ()=>{
            socket.disconnect();
            socketRef.current=null;
        }
    },[isAuth])
return(<socketContext.Provider value={{socket:socketRef.current}}>{children}</socketContext.Provider>)
}
export const useSocket=()=>useContext(socketContext)