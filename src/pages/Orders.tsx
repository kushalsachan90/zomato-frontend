import { useSocket } from "../context/socketContext";
import audio from "../assets/kave_msri-ding-sfx-330333.mp3"
import { useRef } from "react";
import { useEffect, useState } from "react";
import { type IOrder } from "../types";
import api from "../api/axios";
import { RestaurantService } from "../main";
import { useNavigate } from "react-router-dom";

const ACTIVE_STATUS = ["placed", "preparing", "ready_for_rider", "picked_up", "accepted", "rider_assigned"];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "placed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "accepted":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "preparing":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "ready_for_rider":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "rider_assigned":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "picked_up":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const formatStatus = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const Orders = () => {
  const { socket } = useSocket();
  const [orders, setOrder] = useState<IOrder[]>([]);
  const [audioUnlock, setAudioUnlock] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    audioRef.current = new Audio(audio);
    audioRef.current.load();
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current && !audioUnlock) {
        audioRef.current.play().then(() => {
          audioRef.current!.pause();
          audioRef.current!.currentTime = 0;
          setAudioUnlock(true);
        }).catch((err) => {
          console.log("failed to unlock the audio", err);
        });
      }
    };

    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, [audioUnlock]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`${RestaurantService}/api/Orders/myOrders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setOrder(data.orders || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onOrderUpdate = () => {
      if (audioUnlock && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => console.log(error));
      }
      fetchOrder();
    };
    socket.on("order:update", onOrderUpdate);

    return () => {
      socket.off("order:update", onOrderUpdate);
    };
  }, [audioUnlock, socket]);

  useEffect(() => {
    if (!socket) return;
    const onUpdateOrder = () => {
      fetchOrder();
    };


   
    socket.on("order:rider_assigned", onUpdateOrder);

    return () => {
      socket.off("order:rider_assigned", onUpdateOrder);
    };
  }, [socket]);




  if (loading) {
    return <p className="text-center font-bold text-lg py-10">Loading Orders....</p>;
  }

  const activeOrders = orders.filter((o) => ACTIVE_STATUS.includes(o.status));
  const completedOrders = orders.filter((o) => !ACTIVE_STATUS.includes(o.status));

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {/* ---------- Active Orders Section ---------- */}
      <h2 className="text-lg font-bold text-gray-700 mb-3">Active Orders</h2>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <span className="text-4xl mb-2">🍽️</span>
          <p className="text-lg font-medium">No Active Orders Yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {activeOrders.map((order) => (
            <button
              key={order._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              onClick={() => navigate(`/orderdetail/${order._id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-gray-400">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusStyle(order.status)}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    {item.quantity && <span className="text-gray-400">x{item.quantity}</span>}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ---------- Completed Orders Section ---------- */}
      <h2 className="text-lg font-bold text-gray-700 mb-3 mt-6">Completed Orders</h2>

      {completedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <span className="text-4xl mb-2">🍽️</span>
          <p className="text-lg font-medium">No Completed Orders Yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {completedOrders.map((order) => (
            <button
              key={order._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              onClick={() => navigate(`/orderdetail/${order._id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-gray-400">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusStyle(order.status)}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    {item.quantity && <span className="text-gray-400">x{item.quantity}</span>}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
              </div>
            </button>

          
          
          
          ))}

          
        </div>
    
       
      )
      
      
      }
      
    </div>
  );
};

export default Orders;