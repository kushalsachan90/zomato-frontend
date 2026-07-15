import { RestaurantService } from "../main";
import {type IRestaurant } from "../types";
import { type IMenuItem } from "../types";
import { useParams } from "react-router-dom"
import api from "../api/axios";

import { useEffect, useState } from "react";
import RestaurantProfile from "../components/RestaurantProfile";
import MenuItems from "../components/MenuItems";
const UserRestaurantPage = () => {
    const {id}=useParams();
    const[restaurant,setRestaurant]=useState<IRestaurant|null>(null);
    const [menuItems,setMenuItems]=useState<IMenuItem[]>([]);
    const [loading,setloading]=useState(true);

    const fetchRestaurant=async()=>{
        try {
            const {data}=await api.get(`${RestaurantService}/api/restaurant/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            setRestaurant(data||null)
        } catch (error) {
            console.log(error)
        }
        finally{
            setloading(false)
        }
    }

    const fetchMenuItems=async()=>{
    try {
        const{data}=await api.get(`${RestaurantService}/api/menuItem/all${id}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })

        setMenuItems(data)
    } catch (error) {
      console.log(error);  
    }
}

useEffect(()=>{
    fetchMenuItems();
    fetchRestaurant();

},[id])

if(loading){
    <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">loading...</p>
    </div>
}

if(!restaurant){
    return(
    <div className="flex items-center justify-center">
        <h2 className="text-gray-500 font-semibold">No restaurant found for this Id</h2>
    </div>
)}
  return (
    <div className="min-h-screen ">
        <RestaurantProfile restaurant={restaurant} onUpdate={setRestaurant} isSeller={false}/>
        <div className="py-4 shadow-sm bg-white rounded-xl">
        <MenuItems menuItems={menuItems} isSeller={false} onItemDeleted={fetchMenuItems} onStatusupdated={fetchMenuItems} />
        </div>
    </div>
  )
}

export default UserRestaurantPage