import { useParams } from "react-router-dom"
import { type IOrder } from "../types";
import { useState, useEffect } from "react";
import { RestaurantService } from "../main";
import api from "../api/axios";
import { useSocket } from "../context/socketContext";
import MapforUser from "./MapforUser";

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
    case "delivered":
      return "bg-green-50 text-green-700 border-green-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const formatStatus = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const OrderDetails = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<IOrder | null>(null);

  // Is specific order ke rider ki live location
  const [riderLocation, setRiderLocation] = useState<[number, number] | null>(null);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`${RestaurantService}/api/Orders/singleOrder/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setOrder(data.order);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const onOrderUpdate = () => {
      fetchOrderDetails();
    };
    socket.on("order:update", onOrderUpdate);

    return () => {
      socket.off("order:update", onOrderUpdate);
    };
  }, [orderId, socket]);

   useEffect(() => {
    if (!socket) return;
    const onUpdateOrder = () => {
      fetchOrderDetails();
    };


   
    socket.on("order:rider_assigned", onUpdateOrder);

    return () => {
      socket.off("order:rider_assigned", onUpdateOrder);
    };
  }, [socket]);

  // Rider ki live location sunne ke liye
  useEffect(() => {
    if (!socket) return;

    const onRiderLocation = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      setRiderLocation([latitude, longitude]);
            console.log(latitude,longitude,"hey i am acceptinig")
    };

    
    socket.on("rider:location", onRiderLocation);

    return () => {
      socket.off("rider:location", onRiderLocation);
    };
  }, [socket]);

  if (loading) {
    return <p className="text-center font-bold text-lg py-10">Loading Order Details....</p>;
  }

  if (!order) {
    return <p className="text-center text-gray-400 py-10">Order not found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getStatusStyle(order.status)}`}>
          {formatStatus(order.status)}
        </span>
      </div>

      {/* Restaurant Name */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
        <p className="text-xs text-gray-400 mb-1">Restaurant</p>
        <p className="text-lg font-semibold text-gray-800">{order.restaurantName}</p>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
        <p className="text-xs text-gray-400 mb-3">Items</p>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item.itemId} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-800">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
        <p className="text-xs text-gray-400 mb-2">Delivery Address</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {order.deliveryAddress?.formattedAddress}
        </p>
        {order.deliveryAddress?.mobileNo && (
          <p className="text-sm text-gray-500 mt-2">📞 {order.deliveryAddress.mobileNo}</p>
        )}
      </div>

      {/* Rider Info - only if assigned */}
      {order.riderId && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-2">Delivery Partner</p>
          <p className="text-sm font-medium text-gray-700">{order.riderName}</p>
          {order.riderPhone && (
            <p className="text-sm text-gray-500 mt-1">📞 {order.riderPhone}</p>
          )}
        </div>
      )}

      {/* Live Tracking Map — sirf tab dikhega jab rider assigned/picked-up ho aur location aa chuki ho */}
      {(order.status === "rider_assigned" || order.status === "picked_up") && riderLocation && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-2">Live Tracking</p>
          <MapforUser order={order} riderLocation={riderLocation} />
        </div>
      )}

      {/* Bill Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-gray-400 mb-3">Bill Summary</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.deliveryFee !== undefined && (
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
          )}
          {order.platformFee !== undefined && (
            <div className="flex justify-between text-gray-600">
              <span>Platform Fee</span>
              <span>₹{order.platformFee}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-xl font-bold text-gray-900">₹{order.totalAmount}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">Payment</span>
          <span className={`text-xs font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
            {order.paymentMethod?.toUpperCase()} • {formatStatus(order.paymentStatus)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;