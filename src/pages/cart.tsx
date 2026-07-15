import { AppData } from "../context/AppContext"
import { useState } from "react";
import type { IMenuItem, IRestaurant } from "../types";
import { RestaurantService } from "../main";
import api from "../api/axios";
import type { ICart } from "../types";
import { BiLoader, BiMinus } from "react-icons/bi";
import { BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const {cart,fetchCart,quantity,subtotal}=AppData()
       const navigate=useNavigate();
 const[loadingItemId,setLoadingItemId]=useState<string | null>(null);
      const[clearingcart,setclearingCart]=useState(false);
 if(!cart||cart.length===0){

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
  <div className="text-gray-600 font-semibold text-3xl border rounded-xl p-6 shadow-md">
    Your cart is Empty
  </div>
</div>
  )

 }

 const restaurant=cart[0].restaurantId  as IRestaurant;

 const deliveryFee=subtotal<250?49:0;
 const platformFee=7;
 const grandTotal=platformFee+subtotal+deliveryFee;


 const Increment=async(itemId:string)=>{
  try {
    setLoadingItemId(itemId);
   await api.put(`${RestaurantService}/api/cart/inc`,{itemId},{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })

   await  fetchCart()
  } catch (error) {
    console.log(error)
  }
  finally{
    setLoadingItemId(null)
  }
 }

const Decrement=async(itemId:string)=>{
  try {
    setLoadingItemId(itemId);
   await api.put(`${RestaurantService}/api/cart/dec`,{itemId},{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })

   await  fetchCart()
  } catch (error) {
    console.log(error)
  }
  finally{
    setLoadingItemId(null)
  }
 }

 const clearCart=async()=>{
  try {
    setclearingCart(true);
     await api.delete(`${RestaurantService}/api/cart/delete`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      }
     })
     await fetchCart();
  } catch (error) {
    console.log(error);
  }finally{
    setclearingCart(false);
  }
 }


 const checkout=()=>{
  navigate('/checkout');
 }


return  <div className="p-6  mx-auto max-w-3xl">
           <div className=" border shadow-md rounded-2xl p-2 ">
            <div className="font-bold text-3xl text-blue-700 ">{restaurant.name}</div>
           <div className="text-red-400 ">{restaurant.autoLocation.formattedAddress}</div>
           </div>


     <div className="space-y-6 py-5">
  {
    cart.map((cartItem:ICart)=>{

      if (typeof cartItem.itemId === "string") {
  return null;
}
       const item=cartItem.itemId as IMenuItem
       const isloading=loadingItemId===item._id
         
        return (
          <div   key={item._id} className="flex items-center bg-blue-50 rounded-xl shadow-md border-b p-4  transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
         
          <img src={item.image} alt="" className="h-20 w-20 " />

             <div className="flex-1 px-4">      
            <h3 className="font-semibold">{item.name}</h3>
            <p >₹{item.price}</p>
     </div>

        <div className="flex items-center justify-center">

           <button  className="rounded-full border p-2 hover:bg-gray-50 disabled-opacity-50" disabled={isloading} onClick={()=>{Decrement(item._id)}}>
              {
                isloading?(<BiLoader className="animate-spin"/>):(<BiMinus size={20}/>)
              }
            </button>
           <span className="p-2 t font-mendium font-xl">
            {cartItem.quantity}
                   </span> 
            <button  className="rounded-full border p-2 hover:bg-gray-50 disabled-opacity-50" disabled={isloading} onClick={()=>{Increment(item._id)}}>
              {
                isloading?(<BiLoader className="animate-spin"/>):(<BiPlus size={20}/>)
              }
            </button>
           

        </div>

               <div className=" text-right w-20 font-bold"> ₹{item.price*cartItem.quantity}</div> 
          </div>


        )
    })



    
  }

  <div className="flex  flex-col  border rounded-2xl shadow-2xl bg-blue-100">
                              <h2 className="font-medium text-xl flex items-center justify-center">Summary </h2>
                              <div className=" flex justify-between px-20 space-y-3">
                                    <span className="text-md">Total Item</span>
                                    <span>{quantity}</span>     
                              </div>

                              <div className=" flex justify-between px-20 space-y-3">
                                    <span className="text-md">SubTotal</span>
                                    <span>₹{subtotal}</span>     
                              </div>

                               <div className=" flex justify-between px-20 space-y-3">
                                    <span className={`deliveryFee===0?"Free":${deliveryFee}`}>Delivery Fee</span>
                                    <span>₹{deliveryFee}</span>     
                              </div>
                            

                              <div className=" flex justify-between px-20 space-y-3 border-b">
                                    <span className="text-md">Platform Fee</span>
                                    <span>₹{platformFee}</span>     
                              </div>

                              {
                                subtotal<250&&(<p className="font text-gray-500 font-xs text-center">
                                  Add worth more ₹{250-subtotal} to get free delivery 
                                </p>)
                              }

                               <div className=" flex justify-between px-20 space-y-3">
                                    <span className="font-bold text-xl">Grand Total</span>
                                    <span className="font-bold text-xl">₹{grandTotal}</span>     
                              </div>

                              
  </div>
 <div
  className={`flex items-center justify-center rounded-2xl p-3 shadow-md
    transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl
    ${restaurant.isOpen ? "bg-amber-400" : "bg-gray-500"}`}
>
 <button
  className="text-xl w-full"
  onClick={() => {
    if (!restaurant.isOpen) {
      alert("Restaurant is closed");
      return;
    }

    const unavailableItem = cart.find(
      (cartItem) =>
        typeof cartItem.itemId !== "string" &&
        cartItem.itemId.isAvailable === false
    );

    if (unavailableItem && typeof unavailableItem.itemId !== "string") {
      alert(`${unavailableItem.itemId.name} is unavailable in your cart`);
      return;
    }

    checkout();
  }}
>
  {restaurant.isOpen ? "Checkout" : "Restaurant Closed"}
</button>
</div>

     <div className={`flex items-center justify-center rounded-2xl bg-gray-500 shadow- md p-3 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl`}>
 <button className="text-xl" onClick={clearCart} disabled={clearingcart}> {clearingcart && <BiLoader className="animate-spin" />}
    {clearingcart ? "Clearing..." : "Clear Cart"}</button>   
     </div>  
</div>
       
 </div>
 

 
}

export default Cart