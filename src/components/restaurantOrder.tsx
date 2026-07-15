const ACTIVE_STATUS=["placed","accepted" ,"preparing" ,"ready_for_rider","rider_assingned","picked_up"]
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/socketContext";
import  {type IOrder} from "../types"
import audio from "../assets/mixkit-fairy-message-notification-861.wav"
import api from "../api/axios";
import { RestaurantService } from "../main";
import OrderCard from "./orderCard";
const RestaurantOrder = ({restaurantId}:{restaurantId:string}) => {
    const [orders,setOrders]=useState<IOrder[]>([]);
    const [loading,setLoading]=useState(true);
    const [audioUnlock ,setAudioUnlock]=useState(false);
   
    const {socket}=useSocket()
    const audioRef=useRef<HTMLAudioElement|null>(null);

    useEffect(()=>{
       audioRef.current=new Audio(audio);
       audioRef.current.load()
    },[]);

    const fetchOrder=async()=>{
        try{
            const {data}= await api.get(`${RestaurantService}/api/Orders/fetchOrderForPayment/${restaurantId}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(data,"data in restaurantservices")
            setOrders(data.orders||[])
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const unlockAudio=()=>{
        if(audioRef.current){
            audioRef.current.play().then(()=>{
                audioRef.current!.pause();
                audioRef.current!.currentTime=0;
                setAudioUnlock(true);
                console.log("Audio unlocked")
            }).catch((err)=>{
                console.log("failed to unlock the audio",err)
            })
        }
    }

    useEffect(()=>{
        fetchOrder()
    },[restaurantId])



useEffect(()=>{
    if(!socket) return;
    const onNewOrder=()=>{
        console.log("New Order Received from socket");

        if(audioUnlock&&audioRef.current){
            audioRef.current.currentTime=0;
            audioRef.current.play().then(()=>console.log("audio Played")).catch((error)=>console.log(error))
        }
        fetchOrder()
    }
    socket.on("order:new",onNewOrder);

    return ()=>{
        socket.off("order:new",onNewOrder)
    }
},[audioUnlock,socket])

  useEffect(()=>{
    if(!socket) return ;
    const onUpdateOrder=()=>{
      fetchOrder();
    }
    socket.on("order:rider_assigned",onUpdateOrder)

    return ()=>{
      socket.off("order:rider_assigned",onUpdateOrder)
    }
  },[socket])

if(loading){
    return <p className="text-gray-500">Loading Orders</p>
}
 const completedOrders=orders.filter((o)=>!ACTIVE_STATUS.includes(o.status))
  const activeOrders=orders.filter((o)=> ACTIVE_STATUS.includes(o.status));
  console.log(activeOrders,"activeOrders")
return (
  <div>
    {
        !audioUnlock && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between m-2">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🔔</span>
                    <span className="text-md text-blue-600 font-medium">Enable sound Notification</span>
                </div>
                <button 
                    onClick={unlockAudio} 
                    className="p-3 border border-blue-900 rounded-xl bg-blue-100 text-blue-800"
                >
                    Enable sound
                </button>
            </div>
        )
    }


 {
   
      activeOrders.length==0?<p>No Active Orders</p>:<div className="grid grid-cols-1 md:grid-cols-2">
        {
            activeOrders.map((order)=>(
                <OrderCard order={order} onOrderupdate={fetchOrder} key={order._id} />
            ))
        }

        

      </div>
 }

{
    completedOrders.length==0?<p>No Completed Orders</p>:<div className="grid grid-cols-1 md:grid-cols-2">
        {
            completedOrders.map((order)=>(
                <OrderCard order={order} onOrderupdate={fetchOrder} key={order._id} />
            ))
        }

        

      </div>
    

}
</div>
)


  

  return (
    <div>restaurantOrder</div>
  )
}

export default RestaurantOrder