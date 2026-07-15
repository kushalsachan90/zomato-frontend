import {useSearchParams} from 'react-router-dom';
import { UtilsService } from '../main';
import api from '../api/axios';
import { useEffect } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
const Ordersuccess = () => {
    const [params]=useSearchParams();
    const paymentId=params.get("session_id");
    const navigate=useNavigate();
    useEffect(()=>{


        if(!paymentId){
        return;
    }
        const verifyStripePayment=async()=>{
            try{
              await api.post(`${UtilsService}/api/payment/stripe/verify`,{
                    sessionId:paymentId
                })
            }catch(error){
                console.error("Error verifying Stripe payment:", error);
            }
        };
        verifyStripePayment();  
    }, [paymentId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="w-[50vw] bg-white rounded-xl shadow-lg p-10">
            <div className="flex items-center justify-center">
              <BiCheckCircle size={60} className="text-green-600"/>
             
            </div>
             <p className="text-center text-xl font-bold text-gray-700">
          Your Order Placed Successfully! 🎉
        </p>
        
        <p className="text-center border-b pb-2">
          <span className="text-blue-600 font-medium mr-2">Payment ID:</span>
          <span className="text-gray-700">{paymentId}</span>
        </p>
             <div className="flex items-center justify-center p-2">
              
             <button onClick={()=>navigate('/orders')} className="text-2xl font-medium w-[20vw] shadow-md border rounded-xl p-2 bg-blue-300">your Orders</button>
             </div>
        
              <div className="flex items-center justify-center p-2">
              
             <button onClick={()=>navigate('/')} className="text-2xl font-medium w-[20vw] shadow-md border rounded-xl p-2 bg-blue-300">Order More</button>
             </div>
            {/* baaki content */}
          </div>
        </div>
    )
}

export default Ordersuccess;