import { createContext,useContext,type ReactNode } from "react";
import { useState } from "react";
import { authService, RestaurantService } from "../main";
import api from "../api/axios";
import { useEffect } from "react";
import {type ICart } from "../types";
import type { AppContextType, LocationData } from "../types";
import type { User } from "../types";
import { Toaster } from "react-hot-toast";
const AppContext =createContext<AppContextType | undefined>(undefined)

interface AppProviderProps{
    children:ReactNode
}
    
export const AppProvider =({children}:AppProviderProps)=>{
    const [user,setUser] = useState<User | null>(null)
    const [isAuth,setIsAuth] =useState(false)
    const [loading,setloading] =useState(true)
    const [location ,setLocation]=useState<LocationData | null>(null)
    const  [loadingLocation,setLoadingLocation]= useState(false)

    const [city,setCity]=useState("Fetching Location ")


  
        

async function fetchUser() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  console.log(refreshToken,"refreshToken")
  if (!token && !refreshToken) {
    setIsAuth(false);
    setUser(null);
    setloading(false);
    return;
  }

  try {
    const { data } = await api.get(`${authService}/api/authroute/me`);

    if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);   // <-- ye line add hui kya?
}
    setUser(data.user);
    setIsAuth(true);
  } catch (error) {
    console.log(error);
    setIsAuth(false);
    setUser(null);
  } finally {
    setloading(false);
  }
}

const [cart,setCart]=useState<ICart[]>([]);

    const [subtotal,setsubtotal]=useState(0);
    const [quantity,setquantity]=useState(0);

    async function fetchCart(){
      if(!user ||user.role!=="customer") return 

      try {
         const {data}=await api.get(`${RestaurantService}/api/cart/get`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
         })
        

         setCart(data.cart ||[]);
         setsubtotal(data.subtotal||0);
         setquantity(data.cartLength)
      } catch (error) {
        console.log(error)
      }

      
    }

  useEffect(()=>{
    if(user&&user.role==="customer")
    fetchCart()
  },[user])
     
    useEffect(()=>{
        console.log("🔴 fetchUser useEffect chala")

        fetchUser();
    },[])
   useEffect(() => {
  console.log("🔴 geolocation useEffect chala");

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  setLoadingLocation(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude,accuracy } = position.coords;
       console.log(latitude,longitude,accuracy,"lat log")
       
      try {
        const data = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        console.log("location data:", data);

        const result = await data.json();

        console.log("location result:", result);

        setLocation({
          latitude,
          longitude,
          formattedAddress: result.display_name || "Unknown Location",
        });

        setCity(
          result.address.city ||
          result.address.town ||
          result.address.village ||
          result.address.county||
          "Unknown City"
        );

        setLoadingLocation(false);
      } catch (error) {
        console.log(error);

        setLocation({
          latitude,
          longitude,
          formattedAddress: "Unknown Location",
        });

        setCity("Unknown City");
        setLoadingLocation(false);
      }
    },
    undefined,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}, []);
 return <AppContext.Provider value={{isAuth,loading,location,setIsAuth,setloading,setLocation,setUser,user,fetchUser,loadingLocation,city,setCity,cart,fetchCart,subtotal,quantity,setCart,setquantity}}>{children} <Toaster/></AppContext.Provider>
}

export const AppData=():AppContextType=>{
    const context=useContext(AppContext);
    if(!context){
        throw new Error("useAppData must be used within AppProvider")
    }
    return context;
}
        