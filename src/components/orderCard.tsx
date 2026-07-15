import api from "../api/axios";
import { RestaurantService } from "../main";
import {type IOrder } from "../types";
import { ORDER_ACTIONS } from "../utils/orderflow";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
interface props{
    order:IOrder,
    onOrderupdate:()=>void
}
 
const status = (status: string) => {
  switch (status) {
    case "placed":
      return "bg-yellow-100 text-yellow-700";
    case "accepted":
      return "bg-blue-100 text-blue-700";
    case "preparing":
      return "bg-orange-100 text-orange-700";
    case "ready_for_rider":
      return "bg-purple-100 text-purple-700";
    case "picked_up":
      return "bg-indigo-100 text-indigo-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
      case "delivered":
        return "bg-green-300 text-white-700"
    default:
      return "bg-gray-100 text-gray-700";
  }
};
 

const OrderCard = ({order,onOrderupdate}:props) => {
  
  const [loading,setLoading]=useState(false);
  const [retryvisible,setretryvisible]=useState(false);
  const actions=ORDER_ACTIONS[order.status]||[];
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(()=>{
    if(order.status!=="ready_for_rider"){
      setretryvisible(false);
      return ;
    }
    const timer=setTimeout(()=>{
          setretryvisible(true);
    },10000)
    retryTimerRef.current = timer;

    return ()=> clearTimeout(timer);
  },[order.status])

  const updateStatus=async(status:string)=>{
    try {
      setLoading(true);
      await api.put(`${RestaurantService}/api/Orders/updateOrderStatus/${order._id}`,{status},{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      toast.success("Order updated")
      onOrderupdate?.();
    } catch (error:any) {
     toast.error(error.response.data.message)
    }finally{
      setLoading(false);
    }
  }

  const handleRetry = async () => {
    // Turant button chhupao aur purana timer clear karo
    setretryvisible(false);
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

    await updateStatus("ready_for_rider");

    // Naya 10 sec ka timer manually start karo
    retryTimerRef.current = setTimeout(() => {
      setretryvisible(true);
    }, 10000);
  }

  return (
    <div className="rounded-xl shadow-md py-3 m-3">
      <div className="flex items-center justify-between">
        <p className="text-md px-2">Order #{order._id.slice(-6)}</p>
                <span className={`rounded-full text-xs px-2 py-2  items-center ${status(order.status)}`}>{order.status}</span>

      </div>

      <div className="text-gray-500 px-2">
        {
          order.items.map((item)=>(
            <p>{item.name}*{item.quantity}</p>
          ))
        }
      </div>

      <div className="flex items-center justify-between px-2">
           <p className="text-md font-bold">Total</p>
           <span className="text-amber-800">₹{order.totalAmount}</span>
      </div>

      <p className="text-gray-500 px-2">payentStatus:{order.paymentStatus}</p>

      {
       actions.length>0 && actions.map((action)=>(
          <button key={action} disabled={loading} onClick={()=>updateStatus(action)} className="rounded-xl shadow-sm border bg-red-500 p-1">Mark as {action}</button>
        ))
      }
      {
        retryvisible && (
          <button
            disabled={loading}
            onClick={handleRetry}
            className="rounded-xl shadow-sm border bg-amber-500 p-1 mt-2 disabled:opacity-50 hover:brightness-95 transition-all"
          >
            Retry - Notify Riders
          </button>
        )
      }

    </div>
  )
}

export default OrderCard