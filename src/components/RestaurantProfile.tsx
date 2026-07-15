
import { useState } from "react";
import type {IRestaurant} from  "../types"
import api from "../api/axios";
import { RestaurantService } from "../main";
import { toast } from "react-hot-toast";
import { BiEdit, BiMapPin, BiSave } from "react-icons/bi";

import { AppData } from "../context/AppContext";

interface RestaurantProfileProps{
    restaurant: IRestaurant,
    isSeller:boolean,
    onUpdate:(restaurant:IRestaurant)=>void
}

const RestaurantProfile = ({ restaurant, isSeller, onUpdate }: RestaurantProfileProps) => {
     const { setUser, setIsAuth } = AppData();
    const [editMode,setEditMode]=useState(false);
    const [name,setName]=useState(restaurant.name);
    const [description,setDescription]=useState(restaurant.description || '');
    const [isOpen,setIsOpen]=useState(restaurant.isOpen)
    const[loading,setLoading]=useState(false);

    const toggleOpenStatus=async()=>{
        try {
            const {data}=await api.put(`${RestaurantService}/api/restaurant/status`,{status:!isOpen},
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setIsOpen(!isOpen);

            toast.success(data.message)
        } catch (error:any) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
    
    const logOut=()=>{
       localStorage.removeItem("refreshToken")
       localStorage.removeItem("token")
       setIsAuth(false);
       setUser(null);
      window.location.href = "/login" 
    }

const saveChanges=async()=>{
    try {
        setLoading(true)
        const {data}=await api.put(`${RestaurantService}/api/restaurant/update`,{name,description},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(data.restaurant,"updated restaurant");

        setEditMode(false);
        onUpdate(data.restaurant);
        toast.success(data.message)
       
    }
    catch(error){
        console.log(error)
    }
    finally{
        setLoading(false);
    }

}


  return (
    <div className="mx-auto max-w-xl rounded-xl bg-white shadow-sm overflow-hidden mt-5">
        {
            restaurant.image && <img src={restaurant.image} alt={restaurant.name} className="w-full h-64 object-cover" />
        }
        <div className="p-6 space-y-4">
      {  (<div className="flex items-start justify-end">
        <div>
            {
                editMode?(
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="border p-1 rounded w-full" />
                ):(
                    <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                )
            }
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <BiMapPin className="h-4 w-4 text-red-500" />
                {restaurant.autoLocation.formattedAddress||"Location unavailable"}
            </div>
        </div>
        {isSeller && (
        <button onClick={()=>setEditMode(!editMode)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <BiEdit className="h-5 w-5" />
        </button>
)}


       </div>
      )}

      {/* {
        !isSeller && (<h2 className="text-2xl font-bold">{restaurant.name}</h2>)
      } */}


      {
        editMode ? (
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="border p-1 rounded w-full" />
        ) : (
          <p className="text-gray-700">{restaurant.description||"No description available"}</p>
        )
      }

      <div className="flex items-center justify-between pt-3 border-t">
        <span className={`text-sm font-medium ${isOpen ? 'text-green-500' : 'text-red-500'}` }>
          {isOpen ? 'Open' : 'Closed'}
        </span>

        <div className="flex gap-3">
            {
                editMode && (<button onClick={saveChanges} className="flex  items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={loading}>
                 <BiSave size={18}/>
                 save
                </button>
            )}

            {
                isSeller && (<button onClick={toggleOpenStatus} className={`flex items-center justify-center px-4 py-2 rounded cursor-pointer ${isOpen ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                    {isOpen ? 'Close Restaurant' : 'Open Restaurant'}
                </button>)
            }

            {
                isSeller && (<button onClick={logOut} className={`flex items-center justify-center px-4 py-2 rounded cursor-pointer bg-red-500`}>
                 LogOut
                </button>)
            }
        </div>

      </div>
      <p className="text-xs text-gray-500">
        {restaurant.createdAt && `Created: ${new Date(restaurant.createdAt).toLocaleDateString()}`}
      </p>
        </div>
    
    </div>
  )
}

export default RestaurantProfile