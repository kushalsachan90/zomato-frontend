import { useState } from "react";
import { AppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import api from "../api/axios";


 type Role="customer" | "restaurant Owner" | "delivery Partner"|"null"
 function SelectRole(){
    const navigate=useNavigate();
    const [role,setRole]=useState<Role |null>(null);
    const {setUser}=AppData()
    const roles:Role[] = ["customer", "restaurant Owner", "delivery Partner"];

    const addRole=async ()=>{
        try {
            const {data}=await api.put(`${authService}/api/authroute/add/role`,{role},{headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }})
        
            setUser(data.user);

            // NAYA: turant naya access token lo (restaurantId ke liye agar owner bane hain)
            const refreshToken = localStorage.getItem("refreshToken");
            const { data: refreshData } = await api.post(`${authService}/api/authroute/refresh`, {
                refreshToken
            });
            localStorage.setItem("token", refreshData.accessToken);

            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }
   return (
        <div className="flex  min-h-screen items-center justify-center">
            <div className="w-full max-w-sm space-y-6">
            <h1 className="text-4xl font-bold mb-6 text-center text-red-700">Choose your Role</h1>
            <div className="space-y-4">
                {
                    roles.map((r)=>(
                        <button key={r} onClick={()=>setRole(r)} className={`w-full py-2 px-4 border rounded-md ${role===r? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100" }`} >
                             Continue as {r}
                        </button>

                    ))
                }
            </div>
            <button disabled={!role} onClick={addRole} className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50">
                Continue
            </button>
            </div>
           
          </div>
    )

 }
 export default SelectRole;