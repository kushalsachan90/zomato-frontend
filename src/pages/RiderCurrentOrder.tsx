import { useState } from "react";
import api from "../api/axios";
import { RiderService } from "../main";
import toast from "react-hot-toast";
import { type IOrder } from "../types";

interface Props {
  order: IOrder;
  onupdateStatus: () => void;
}

const statusStyle = (status: string | null | undefined) => {
  switch (status) {
    case "rider_assigned":
      return "bg-indigo-100 text-indigo-700";
    case "picked_up":
      return "bg-cyan-100 text-cyan-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatStatus = (status: string | null | undefined) => {
  if (!status) {
    return "Unknown";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const RiderCurrentOrder = ({ order, onupdateStatus }: Props) => {
  const [loading, setLoading] = useState(false);
  const [reachedRestaurant, setReachedRestaurant] = useState(false);

  const updateStatus = async (status: string) => {
    try {
      setLoading(true);

      await api.put(
        `${RiderService}/api/rider/updateOrder/${order._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Status updated");
      onupdateStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const renderActionButton = () => {
    if (order.status === "rider_assigned" && !reachedRestaurant) {
      return (
        <button
          onClick={() => setReachedRestaurant(true)}
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          Reached Restaurant
        </button>
      );
    }

    if (order.status === "rider_assigned" && reachedRestaurant) {
      return (
        <button
          onClick={() => updateStatus("picked_up")}
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-medium bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Picked Up Order"}
        </button>
      );
    }

    if (order.status === "picked_up") {
      return (
        <button
          onClick={() => updateStatus("delivered")}
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Mark as Delivered"}
        </button>
      );
    }

    if (order.status === "delivered") {
      return (
        <div className="w-full py-2.5 rounded-lg font-medium bg-green-100 text-green-700 text-center">
          Order Delivered ✓
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 shadow-md p-4 flex flex-col gap-3 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          {order.restaurantName}
        </h3>

        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(
            order.status
          )}`}
        >
          {formatStatus(order.status)}
        </span>
      </div>

      {/* Order Items */}
      <div className="text-sm text-gray-600 space-y-1">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{item.name}</span>
            <span className="text-gray-400">x{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-200" />

      {/* Delivery Address */}
      <div className="flex items-start gap-2">
        <span className="text-lg">📍</span>
        <p className="text-sm text-gray-600">
          {order.deliveryAddress.formattedAddress}
        </p>
      </div>

      {/* Customer Phone */}
      <div className="flex items-center gap-2">
        <span className="text-lg">📞</span>
        <a
          href={`tel:${order.deliveryAddress.mobileNo}`}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          {order.deliveryAddress.mobileNo}
        </a>
      </div>

      <div className="border-t border-dashed border-gray-200" />

      {/* Rider Fee */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          Your Delivery Fee
        </p>

        <span className="text-lg font-bold text-amber-700">
          ₹{order.riderAmount}
        </span>
      </div>

      {/* Action Button */}
      {renderActionButton()}
    </div>
  );
};

export default RiderCurrentOrder;