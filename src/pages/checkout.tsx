import { AppData } from "../context/AppContext"
import { useEffect, useState } from "react";
import { RestaurantService } from "../main";
import api from "../api/axios";
import type { ICart, IMenuItem, IRestaurant } from "../types";
import toast from "react-hot-toast";
import { UtilsService } from "../main";
import { useNavigate } from "react-router-dom";
import { BiLoader } from "react-icons/bi";
import {loadStripe} from "@stripe/stripe-js";

const stripePromise=loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

  interface Address{
  _id:string,
    userId:string,
    mobileNo:number,
    location:{
        type:'Point',
        coordinates:[number,number],
           formattedAddress:string,
    }

}
const Checkout = () => {
  const {cart,subtotal,quantity,setCart,fetchCart}=AppData();
    const navigate=useNavigate();
  const [addresses,setAddresses]=useState<Address[]>([])
  const [selectedAddress,setselectedAddress]=useState<string|null>(null)
  const [loadingAddress,setLoadingAddress]=useState(true);
  const [loadingRazorpay,setLoadingRazorpay]=useState(false);
  const[loadingStripe,setLoadingStripe]=useState(false);
  const [creatingOrder,setcreatingOrder]=useState(false)
  const [paymentInProgress,setPaymentInProgress]=useState(false)

  useEffect(()=>{
    const fetchAddress=async()=>{
      if(!cart ||cart.length===0){
        setLoadingAddress(false);
        return;
      }

      try {
        const {data}=await api.get(`${RestaurantService}/api/Address/getAddress`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        })
        console.log(data,"data from the address")
        setAddresses(data.Addresses||[])
      } catch (error) {
        console.log(error);
      }finally{
        setLoadingAddress(false)
      }
    }
    fetchAddress();
  },[cart])

  

  
  
  if((!cart||cart.length===0) && !paymentInProgress){
    return <div className=" min-h-screen flex justify-center items-center">
            <div className="text-gray-700 text-3xl"> your cart is Empty
            </div>
    </div>
  }


const restaurant=cart?.[0]?.restaurantId as IRestaurant 
const deliveryFee=subtotal<250?49:0;

const platFormFee=7;

const grandTotal =subtotal + deliveryFee+platFormFee;


  const createOrder=async(paymentMethod:"razorpay"|"stripe")=>{
        try {
          setcreatingOrder(true);
         const {data}=  await api.post(`${RestaurantService}/api/Orders/create`,{paymentMethod,addressId:selectedAddress},{
            headers:{
              Authorization:`Bearer ${localStorage.getItem("token")}`
            }
           })
           toast.success("order created successfully")
          return data;
          
        } catch (error) {
          toast.error("failed on creating the order on database")
          console.log(error);
        }
        finally{
          setcreatingOrder(false);
        }
  }

  const payWithRazorPay=async()=>{
         setPaymentInProgress(true);
         const order= await createOrder("razorpay");
         if(!order){
          setPaymentInProgress(false);
          return;
         }
         const {orderId,amount}= order;
           console.log(orderId,amount ,"orderId and amount")
         try {
           setLoadingRazorpay(true);
           const {data}=await api.post(`${UtilsService}/api/payment/create`,{orderId},
           {
            headers:{
              Authorization:`Bearer ${localStorage.getItem("token")}`
            }
           }
           )
           const {razorpayOrderId,key}=data;
           const options = {
    key: key, 
    amount: amount*100, 
    currency: "INR",
    name: "Zwigato", //your business name
    description: "Food Transaction",
  
    order_id: razorpayOrderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
    handler:async(response:any)=>{
      try {
        await api.post(`${UtilsService}/api/payment/verify`,{
               razorpay_order_id:response.razorpay_order_id,
               razorpay_payment_id:response.razorpay_payment_id,
               razorpay_signature:response.razorpay_signature,
               orderId
        })
        
        toast.success("payment successfull")
    navigate(`/paymentsuccess/${response.razorpay_payment_id}`)
    setCart([]);
         await fetchCart();
      } catch (error) {
        console.log(error);
        toast.error("payment failed")
      }finally{
        setLoadingRazorpay(false)
        setPaymentInProgress(false);
      }
    },

  
    "theme": {
        "color": "#3399cc"
    }
};

    const razorpay= new (window as any).Razorpay(options);
    razorpay.open()

         } catch (error) {
          toast.error("failed to make the razorpay payment")
          console.log(error);
          setLoadingRazorpay(false);
          setPaymentInProgress(false);
         }
         


  }

  const payWithStripe=async()=>{
      setPaymentInProgress(true);
      const order=await createOrder("stripe");
      if(!order){
        toast.error("failed to create stripe order")
        setPaymentInProgress(false);
        return;
      }
      try{
            setLoadingStripe(true);
            const stripe=await stripePromise;
            if(!stripe){
              toast.error("failed to load stripe")
              return;
            }
            const orderId=order.orderId;
            const {data}=await api.post(`${UtilsService}/api/payment/stripe/create`,{orderId},
           {
            headers:{
              Authorization:`Bearer ${localStorage.getItem("token")}`
            }
           }
           )
           if(data.url){
            window.location.href=data.url
           }else{
            toast.error("failed to create payment session")
           }
      }catch(error){
        console.log(error);
        toast.error("failed to create stripe order")
      }finally{
        setLoadingStripe(false);
        setPaymentInProgress(false);
      }
  }

  return (
       <div className="ml-[20vw] " >
    <h1 className="font-bold text-3xl ml-[10vw] py-5 text-green-600 "> CheckOut</h1>
<div className=" rounded-xl shadow-sm w-[60vw] ">
   <div className="ml-10 text-2xl font-bold text-blue-900">
    {restaurant.name}
   
   </div>
     <p className="pl-10 pr-4 text-gray-600">
        {restaurant.autoLocation.formattedAddress}
      </p>
</div>

<div className="py-5">
 <div className=" w-[60vw] shadow-sm rounded-xl ">
        <h1 className="text-3xl font-bold px-5 py-2 text-yellow-800">select Address</h1>
        <div>
          {
           loadingAddress ? (
             <div className="flex items-center gap-2 px-5 py-3 text-gray-500">
               <BiLoader className="animate-spin" /> Loading addresses...
             </div>
           ) : (
           addresses.map((add)=>{
             const isSelected= selectedAddress===add._id
            return( 
            <label  key={add._id} className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
              isSelected
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}>

              <input type="radio" name="address" checked={isSelected} onClick={()=>setselectedAddress(isSelected?null:add._id)}     />
               <div>{add.location.formattedAddress}</div>
          
            </label>
            )
           })
           )
          }
        </div>
      

 </div>

       
   </div>
   <div className="shadow-sm  w-[60vw] rounded-xl gap-50">
      <div className="text-center ">
        <span className="text-xl font-bold text-red-400">summary</span>
      </div>
       
            {
              cart.map((cartItem:ICart)=>{
              const item=cartItem.itemId as IMenuItem;
              return <div className="flex justify-between  m-5" key={item._id} border-b>
                     <span>{item.name}*{cartItem.quantity}</span>
                     <span>₹{item.price*cartItem.quantity}</span>     
              </div>

              
              })
            }

            <hr />


               <div className="flex justify-between text-sm m-5">

                <span>items({quantity})</span>
                      <span>₹{subtotal}</span>
                    
                
               </div>


                <div className="flex justify-between text-sm m-5">

                <span>DeliveryFee</span>

                <span>₹{subtotal>250?"Free":49}</span>
                
               </div>

               <div className="flex justify-between text-sm m-5">

                <span>PlatformFee</span>

                <span>₹7</span>
                
               </div>

               <hr />
               <div className="flex justify-between text-sm m-5">

                <span className="font-bold">GrandTotal</span>

                <span className="font-bold">₹{grandTotal}</span>
                
               </div>


               

               
              
              
        </div>

      <div className="w-[60vw] h-10 flex items-center justify-center rounded-xl shadow-sm border m-2 font-bold text-md bg-blue-400 duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
    <button disabled={loadingRazorpay||creatingOrder} onClick={payWithRazorPay}>
       {(loadingRazorpay||creatingOrder) && <BiLoader className="animate-spin" />}
      PROCEED WITH RAZORPAY</button>
    </div>

<div className="w-[60vw] h-10 flex items-center justify-center rounded-xl shadow-sm border font-bold text-md m-2 bg-gray-400 duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
  {(loadingStripe||creatingOrder) && <BiLoader className="animate-spin" />}
    <button disabled={loadingStripe||creatingOrder} onClick={payWithStripe}>PROCEED WITH STRIPE</button>
</div>
       </div>
  
  )


}

export default Checkout