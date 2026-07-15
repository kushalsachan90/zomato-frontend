
import { useEffect, useState } from "react"
import { type IMenuItem, type IRestaurant } from "../types"
import api from "../api/axios"
import { RestaurantService } from "../main"
import AddRestaurant from "../components/AddRestaurant"
import RestaurantProfile from "../components/RestaurantProfile"
import MenuItems from "../components/MenuItems"
import AddMenuItems from "../components/AddMenuItems"
import RestaurantOrder from "../components/restaurantOrder"
import { AppData } from "../context/AppContext"
type SellerTab="menu"|"add-items"|"sales"

const RestaurantPage = () => {
    const [restaurant,setRestaurant]=useState<IRestaurant | null>(null)
    const [loading ,setloading]=useState(true)
      const [tab,setTab]=useState<SellerTab>("menu");
      const {fetchUser}=AppData();
    const fetchMyRestaurant=async()=>{
        try {
            const {data}=await api.get(`${RestaurantService}/api/restaurant/my-restaurant`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
          
           
            fetchUser();
              setRestaurant(data.restaurant||null)
        } catch (error) {
            console.log(error);   
        } 
        finally{
            setloading(false)
        }
       
    }
    useEffect(() => {
    fetchMyRestaurant()
}, [])


const [menuItems,setMenuItems]=useState<IMenuItem[]>([]);
console.log(restaurant?._id,"restaurantId")

const fetchMenuItems=async(restaurantId:string)=>{
    try {
        const{data}=await api.get(`${RestaurantService}/api/menuItem/get${restaurantId}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })

        setMenuItems(data)
    } catch (error) {
      console.log(error);  
    }
}

 

console.log(menuItems,"menuItems")

 useEffect(()=>{
    if(restaurant?._id){
        fetchMenuItems(restaurant?._id);
    }
 },[restaurant])
       if(loading) return <div><h1>loading ...</h1></div>

       if(!restaurant) return <AddRestaurant  onSuccess={fetchMyRestaurant} />
  return (
    <div>
      <RestaurantProfile restaurant={restaurant} isSeller={true} onUpdate={setRestaurant} />

      <RestaurantOrder restaurantId={restaurant?._id} />
         
         <div className="mt-4 shadow-sm rounded-xl">
            <div className="flex border-b  px-5">
                {[
                    {label:"Menu",value:"menu"},
                    {label:"Add Items",value:"add-items"},
                    {label:"Sales",value:"sales"}
                ].map((t)=>(
                    <button key={t.value} className={`  flex-1  px-4 py-2 font-medium ${t.value === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setTab(t.value as SellerTab)}>
                        {t.label}
                    </button>

                

                ))}
            </div>

            <div className="p-5">
                {tab === "menu" && <MenuItems  menuItems={menuItems}  isSeller={true} onItemDeleted={()=>fetchMenuItems(restaurant._id)} onStatusupdated={()=>fetchMenuItems(restaurant._id)}/>}
                {tab === "add-items" && <AddMenuItems onItemAdded={()=>{fetchMenuItems(restaurant._id); setTab("menu")}} />}
                {tab === "sales" && <p>Sales Content</p>}
            </div>

         </div>

    </div>
  )
}   

export default RestaurantPage
                         