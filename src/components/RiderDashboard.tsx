import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { RiderService } from "../main";
import {type IOrder } from "../types";
import toast from "react-hot-toast";
import { useSocket } from "../context/socketContext";
import audio from "../assets/mixkit-fairy-message-notification-861.wav"
import RiderOrder from "../pages/RiderOrder";
import RiderCurrentOrder from "../pages/RiderCurrentOrder";
import RiderMap from "./riderMap";
interface IRider {
  _id: string;
  picture: string;
  phoneNumber: string;
  addharNumber: string;
  drivingLicence: string;
  isVerified: boolean;
  isAvailable: boolean;
}

// ---------- Shared decorative shell (asphalt bg + lane-line motif) ----------
// Component ke BAHAR define kiya, taaki har render pe naya component na bane
const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#DCDDD8] flex items-center justify-center px-4 py-10 relative overflow-hidden">
    {/* faint dashed lane line running through the page, like a road */}
    <div
      className="absolute left-1/2 top-0 h-full w-0 border-l-2 border-dashed border-[#14171A]/10 -translate-x-1/2"
      aria-hidden="true"
    />
    <div className="relative w-full max-w-md">
      {children}
    </div>
  </div>
);

const RiderDashboard = () => {
  const [profile, setProfile] = useState<IRider | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [Name,setName]=useState("");
  const [phone, setPhone] = useState("");
  const [adhar, setAdhar] = useState("");
  const [licence, setLicence] = useState("");

  const [error, setError] = useState("");

  // Image preview cleanup
  useEffect(() => {
    if (!picture) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(picture);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [picture]);

  // Browser location ko Promise me convert kiya
  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const [incomingOrders, setIncomingOrders] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
  console.log(currentOrder,"hey this is currentOrder")
  const [audioUnlocked, setAudioUnlock] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audio);
    audioRef.current.preload = "auto";
    audioRef.current.load();
  }, []);

  const { socket } = useSocket();

  const unlockAudio = async () => {
    try {
      if (!audioRef.current) return;
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioUnlock(true);
      toast.success("Sound Enabled");
    } catch (error: any) {
      toast.error("Tap again to enable sound",error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const onOrderAvailable = ({ orderId }: { orderId: string }) => {
      setIncomingOrders((prev) =>
        prev.includes(orderId) ? prev : [...prev, orderId]
      );
      if (audioUnlocked && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setTimeout(() => {
        setIncomingOrders((prev) => prev.filter((id) => id !== orderId));
      }, 10000);
    };
    socket.on("order:available", onOrderAvailable);
    return () => {
      socket.off("order:available", onOrderAvailable);
    };
  }, [socket, audioUnlocked]);

  <div>

</div>
  // Logged in rider ka apna profile fetch karta hai
  const fetchMyProfile = async () => {
    try {
       console.log("🔵 fetchMyProfile called")
      const { data } = await api.get(`${RiderService}/api/rider/myprofile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
console.log("🔵 fetchMyProfile response:", data)  
      setProfile(data.account);
    } catch (error: any) {
      console.log(error);
      console.log("🔴 fetchMyProfile error:", error);
    }
  };

  // Page load hote hi check karo ki rider ka profile pehle se bana hua hai ya nahi
  useEffect(() => {
    const checkProfile = async () => {
      setCheckingProfile(true);
      await fetchMyProfile();
      setCheckingProfile(false);
    };

    checkProfile();
  }, []);

  const fetchCurrentOrder = async () => {
  try {
    const { data } = await api.get(
      `${RiderService}/api/rider/fetchcurrentOrder`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(data, "hey this is the data");

    // ✅ agar backend se koi active order nahi mila, to state clear karo
    if (data?.order?.order) {
      setCurrentOrder(data.order.order);
    } else {
      setCurrentOrder(null);
    }
  } catch (error) {
    console.log(error);
    // ✅ error (e.g. 404 "no current order") aane par bhi state clear karo
    setCurrentOrder(null);
  }
};

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  // Rider ko available/unavailable karta hai (PATCH)
  const toggleAvailability = async (
    isAvailable: boolean,
    latitude: number,
    longitude: number
  ) => {
    try {
      await api.patch(
        `${RiderService}/api/rider/toggleAvailability`,
        {
          isAvailable,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  // Toggle button click hone par (jab profile pehle se ban chuka ho)
  const handleToggleClick = async () => {
    if (!profile) return;

    setLoading(true);
    setError("");

    try {
      const { latitude, longitude } = await getCurrentLocation();

      await toggleAvailability(!profile.isAvailable, latitude, longitude);

      await fetchMyProfile();
    } catch (error: any) {
      console.log(error);

      if (error.code === 1) {
        setError("Please allow location permission");
      } else {
        setError(
          error.response?.data?.message || "Failed to update availability"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const createRiderProfile = async () => {
    if (!picture) {
      setError("Please select profile picture");
      return;
    }

    if (!phone || !adhar || !licence||!Name) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First get location
      const { latitude, longitude } = await getCurrentLocation();

      const formData = new FormData();

      formData.append("file", picture);
      formData.append("phoneNumber", phone);
      formData.append("addharNumber", adhar);
      formData.append("drivingLicence", licence);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("riderName",Name)

      const { data } = await api.post(
        `${RiderService}/api/rider/addProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProfile(data.riderProfile);

      // Submit ke turant baad apna latest profile fetch karo
      await fetchMyProfile();

      // Aur wahi location use karke rider ko available/online karo
      await toggleAvailability(true, latitude, longitude);

      // Toggle ke baad latest status ke saath profile dobara fetch karo
      await fetchMyProfile();
    } catch (error: any) {
      console.log(error);

      if (error.code === 1) {
        setError("Please allow location permission");
      } else {
        setError(error.response?.data?.message || "Failed to create profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Jab tak check ho raha hai ki profile hai ya nahi, loader dikhao
  if (checkingProfile) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#C1443C] animate-pulse [animation-delay:-0.3s]" />
            <span className="h-3 w-3 rounded-full bg-[#D9A404] animate-pulse [animation-delay:-0.15s]" />
            <span className="h-3 w-3 rounded-full bg-[#2E7D46] animate-pulse" />
          </div>

          <p className="text-sm text-[#14171A]/50 tracking-wide">
            Checking your status...
          </p>
        </div>
      </Shell>
    );
  }

  // Agar profile pehle se ban chuka hai, to form ke bajaye status/toggle dikhao
  if (profile) {
    const statusColor = profile.isAvailable ? "#2E7D46" : "#C1443C";

    return (
      <Shell>
        {/* Sound unlock button — sirf tab dikhega jab audio abhi unlock nahi hua */}
        {!audioUnlocked && (
          <button
            onClick={unlockAudio}
            className="w-full mb-4 bg-[#F4B400] text-[#14171A] px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2"
          >
            🔔 Enable Sound Notifications
          </button>
        )}

        

        <div className="bg-white rounded-3xl shadow-xl border border-[#14171A]/5 overflow-hidden">
          {/* header strip */}
          <div className="bg-[#F4B400] px-6 py-3">
            <p className="text-[11px] font-black tracking-[0.2em] text-[#14171A] uppercase">
              Rider Profile
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-5 flex items-start gap-2 border-l-4 border-[#C1443C] bg-[#C1443C]/10 px-3 py-2 rounded-r-lg">
                <p className="text-sm text-[#C1443C]">{error}</p>
              </div>
            )}

            {/* photo with live status ring */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="relative mb-3">
                <div
                  className="h-24 w-24 rounded-full p-1"
                  style={{
                    boxShadow: `0 0 0 3px ${statusColor}`,
                  }}
                >
                  <div className="h-full w-full rounded-full overflow-hidden bg-[#14171A]/5 flex items-center justify-center">
                    {profile.picture ? (
                      <img
                        src={profile.picture}
                        alt="rider"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-[#14171A]/40">
                        No image
                      </span>
                    )}
                  </div>
                </div>

                {profile.isAvailable && (
                  <span
                    className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#F5F3EE] animate-pulse"
                    style={{ backgroundColor: statusColor }}
                  />
                )}
              </div>

              <p className="text-base font-bold text-[#14171A]">
                {profile.phoneNumber}
              </p>

              {/* verified / pending stamp */}
              <span
                className={
                  "mt-2 inline-block -rotate-3 border-2 border-dashed rounded-lg px-3 py-1 text-[11px] font-black tracking-widest uppercase " +
                  (profile.isVerified
                    ? "border-[#2E7D46] text-[#2E7D46]"
                    : "border-[#D9A404] text-[#D9A404]")
                }
              >
                {profile.isVerified ? "Verified" : "Pending Verification"}
              </span>
            </div>

            {/* dashed lane divider */}
            <div className="border-t-2 border-dashed border-[#14171A]/10 my-5" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-lg font-black text-[#14171A]">
                  {profile.isAvailable ? "You're online" : "You're offline"}
                </p>

                <p className="text-xs text-[#14171A]/50">
                  {profile.isAvailable
                    ? "Accepting ride requests"
                    : "Not accepting rides right now"}
                </p>
              </div>

              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: statusColor }}
              />
            </div>

          <button
  onClick={handleToggleClick}
  disabled={
    loading ||
    (!!currentOrder && currentOrder.status !== "delivered")   // ✅ delivered हो तो यह false हो जाएगा
  }
  className={
    "w-full rounded-xl py-3 font-black uppercase tracking-widest text-sm text-[#F5F3EE] transition-opacity disabled:opacity-50 " +
    (profile.isAvailable ? "bg-[#C1443C]" : "bg-[#2E7D46]")
  }
>
  {loading
    ? "Updating..."
    : currentOrder && currentOrder.status !== "delivered"
    ? "Complete Current Order First"
    : profile.isAvailable
    ? "Go Offline"
    : "Go Online"}
</button>
{currentOrder && (
  <p className="text-xs text-[#14171A]/50 mt-2 text-center">
    Deliver your active order to change your status
  </p>
)}
          </div>
        </div>
         {/* ✅ यहाँ रखा — same return, same Shell के अंदर, बाकी JSX से पहले */}
      {profile.isAvailable && incomingOrders.length > 0 && (
        <div className="mb-4 rounded-xl shadow-lg bg-white p-4 flex flex-col gap-3">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#14171A]">
            Incoming Orders
          </h3>
          {incomingOrders.map((orderId) => (
            <RiderOrder
              key={orderId}
              orderId={orderId}
              onOrderAccept={() => {
                fetchMyProfile();
                fetchCurrentOrder();
              }}
            />
          ))}
        </div>
      )}
      

      {currentOrder && currentOrder.status && (
        <div className="mb-4 rounded-xl shadow-lg bg-white p-4 flex flex-col gap-3">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#14171A]">
            Current Order
          </h3>
            <RiderCurrentOrder order={currentOrder} onupdateStatus={()=>{
              console.log("onupdateStatus called")
              fetchCurrentOrder();fetchMyProfile()
              }} />
            
        </div>
      )}

{currentOrder && (
  <RiderMap order={currentOrder} />
)}
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Sound unlock button — sirf tab dikhega jab audio abhi unlock nahi hua */}
      {!audioUnlocked && (
        <button
          onClick={unlockAudio}
          className="w-full mb-4 bg-[#F4B400] text-[#14171A] px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2"
        >
          🔔 Enable Sound Notifications
        </button>
      )}

      

      <div className="bg-[#F5F3EE] rounded-3xl shadow-2xl overflow-hidden">
        {/* header strip */}
        <div className="bg-[#F4B400] px-6 py-3">
          <p className="text-[11px] font-black tracking-[0.2em] text-[#14171A] uppercase">
            Complete Your Rider Profile
          </p>
        </div>

        <div className="p-6">
          <p className="text-sm text-[#14171A]/60 mb-6">
            A few details and you're ready to start accepting rides.
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2 border-l-4 border-[#C1443C] bg-[#C1443C]/10 px-3 py-2 rounded-r-lg">
              <p className="text-sm text-[#C1443C]">{error}</p>
            </div>
          )}

          {/* Profile Picture */}

 <div className="mb-4">
            <label className="block text-xs font-bold tracking-wide text-[#14171A]/60 uppercase mb-1.5">
             Name
            </label>

            <input
              type="text"
              placeholder="Enter your Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-[#14171A]/10 rounded-xl px-4 py-2.5 text-[#14171A] placeholder:text-[#14171A]/30 focus:outline-none focus:border-[#F4B400] transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold tracking-wide text-[#14171A]/60 uppercase mb-2">
              Profile Picture
            </label>

            <div className="flex gap-4 items-center">
              <div className="h-16 w-16 rounded-full bg-[#14171A]/5 overflow-hidden flex items-center justify-center shrink-0 border-2 border-dashed border-[#14171A]/15">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-[#14171A]/40">No image</span>
                )}
              </div>

              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-[#14171A]/20 rounded-xl px-4 py-3 text-sm text-[#14171A]/60 text-center hover:border-[#F4B400] hover:text-[#14171A] transition-colors">
                  {picture ? picture.name : "Upload your photo"}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setPicture(e.target.files?.[0] || null);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold tracking-wide text-[#14171A]/60 uppercase mb-1.5">
              Phone Number
            </label>

            <input
              type="text"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-2 border-[#14171A]/10 rounded-xl px-4 py-2.5 text-[#14171A] placeholder:text-[#14171A]/30 focus:outline-none focus:border-[#F4B400] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold tracking-wide text-[#14171A]/60 uppercase mb-1.5">
              Aadhar Number
            </label>

            <input
              type="text"
              placeholder="12-digit Aadhar number"
              value={adhar}
              onChange={(e) => setAdhar(e.target.value)}
              className="w-full border-2 border-[#14171A]/10 rounded-xl px-4 py-2.5 text-[#14171A] placeholder:text-[#14171A]/30 focus:outline-none focus:border-[#F4B400] transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold tracking-wide text-[#14171A]/60 uppercase mb-1.5">
              Driving Licence
            </label>

            <input
              type="text"
              placeholder="Licence number"
              value={licence}
              onChange={(e) => setLicence(e.target.value)}
              className="w-full border-2 border-[#14171A]/10 rounded-xl px-4 py-2.5 text-[#14171A] placeholder:text-[#14171A]/30 focus:outline-none focus:border-[#F4B400] transition-colors"
            />
          </div>

          <button
            onClick={createRiderProfile}
            disabled={loading}
            className="w-full bg-[#F4B400] text-[#14171A] rounded-xl py-3 font-black uppercase tracking-widest text-sm disabled:opacity-50 hover:brightness-95 transition-all"
          >
            {loading ? "Submitting..." : "Submit Profile"}
          </button>
        </div>
      </div>
     
    </Shell>
  );
};

export default RiderDashboard;