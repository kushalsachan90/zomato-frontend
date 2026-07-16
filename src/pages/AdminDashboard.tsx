import { useState, useEffect } from "react";
import api from "../api/axios";
import { AdminService } from "../main";



const AdminDashboard = () => {
    const [restaurant, setRestaurant] = useState<any[]>([]);
    const [rider, setrider] = useState<any[]>([]);
    const [loading, setloading] = useState(true);
    const [tab, setTab] = useState<"restaurant" | "rider">("restaurant");
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const response = await api.get(`${AdminService}/api/admin/restaurant/pending`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
              console.log(response.data.restaurant,"restaurant data")
            setRestaurant(response.data.restaurant,)
     
            const response2 = await api.get(`${AdminService}/api/admin/rider/pending`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(response2.data.rider,"response-rider")
            setrider(response2.data.rider)
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
        }
    }

    const handleVerify = async (id: string, type: "restaurant" | "rider") => {
        setActionLoadingId(id);
        try {
            await api.patch(`${AdminService}/api/admin/verify/${type}/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (type === "restaurant") {
                setRestaurant((prev) => prev.filter((r) => r._id !== id));
            } else {
                setrider((prev) => prev.filter((r) => r._id !== id));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setActionLoadingId(null);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const activeList = tab === "restaurant" ? restaurant : rider;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Review and verify pending accounts</p>

                {/* Tabs */}
                <div className="mt-6 flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
                    <button
                        onClick={() => setTab("restaurant")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            tab === "restaurant"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Restaurants
                        {restaurant.length > 0 && (
                            <span className="ml-2 rounded-full bg-gray-900 px-1.5 py-0.5 text-xs text-white">
                                {restaurant.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setTab("rider")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            tab === "rider"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Riders
                        {rider.length > 0 && (
                            <span className="ml-2 rounded-full bg-gray-900 px-1.5 py-0.5 text-xs text-white">
                                {rider.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="mt-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                        </div>
                    ) : activeList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-sm text-gray-400">No pending {tab === "restaurant" ? "restaurants" : "riders"}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeList.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                        {"address" in item && item.address && (
                                            <p className="mt-0.5 text-xs text-gray-500">{item.address}</p>
                                        )}
                                        {item.phone && (
                                            <p className="mt-0.5 text-xs text-gray-500">{item.phone}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleVerify(item._id, tab)}
                                        disabled={actionLoadingId === item._id}
                                        className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                                    >
                                        {actionLoadingId === item._id ? "Verifying..." : "Verify"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard