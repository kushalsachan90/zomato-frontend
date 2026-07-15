import { BiCheckCircle } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom"


const Paymentsuccess = () => {
  const {paymentId}=useParams<{paymentId:string}>();
  const navigate=useNavigate();

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

export default Paymentsuccess