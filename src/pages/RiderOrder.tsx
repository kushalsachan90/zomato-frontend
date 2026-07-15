import { useState, useEffect } from "react";
import { RiderService } from "../main";
import toast from "react-hot-toast";
import api from "../api/axios";
interface RiderOrderProp {
  onOrderAccept: () => void;
  orderId: string;
}

const RiderOrder = ({ onOrderAccept, orderId }: RiderOrderProp) => {
  const [accepting, setAccepting] = useState(false);
  const [second, setSecond] = useState(10);

  useEffect(() => {
    // अगर पहले ही accept हो चुका है, तो नया interval मत बनाओ
    if (accepting) {
      return;
    }

    const interval = setInterval(() => {
      setSecond((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // cleanup — useEffect के अंदर, setInterval के बाहर (यही सही जगह है)
    return () => clearInterval(interval);
  }, [accepting]);

  const acceptOrder=async()=>{
    try {
        setAccepting(true);
       await api.post(`${RiderService}/api/rider/acceptOrder/${orderId}`,{},{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
       }) 
       onOrderAccept();
    } catch (error:any) {
        toast.error(error);
        console.log(error);
    }
  }

  

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 shadow-lg p-4 flex flex-col gap-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Order #{orderId}</h3>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            second <= 3
              ? "bg-red-100 text-red-600"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {second}s
        </span>
      </div>

      {/* Progress bar — visually दिखाता है कितना समय बचा */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(second / 10) * 100}%` }}
        />
      </div>

      <button
        onClick={acceptOrder}
        disabled={accepting || second === 0}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          accepting
            ? "bg-green-100 text-green-700 cursor-not-allowed"
            : second === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        {accepting ? "Accepted ✓" : second === 0 ? "Expired" : "Accept Order"}
      </button>
    </div>
  );
};

export default RiderOrder;