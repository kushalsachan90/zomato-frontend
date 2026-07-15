
import { useNavigate } from "react-router-dom";
import { AppData } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { HiMiniCircleStack } from "react-icons/hi2"
import { HiMapPin } from "react-icons/hi2";
import { TbLogout2 } from "react-icons/tb";
const Account = () => {

    const {user, setUser,setIsAuth}=AppData();
  
    const firstLetter=user?.name.charAt(0).toUpperCase()||''

    const navigate=useNavigate();
    const logOutHandler=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken')
         setUser(null);
         setIsAuth(false);
         navigate('/login');
        toast.success("Logged out successfully")
    }
  return (
    <div className="min-h-screen bg-gray px-4 py-6">
        <div className="mx-auto max-w-md rounded-lg bg-white shadow-sm">
            <div className="flex  gap-4 p-6 border-b">
                 <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
                    {firstLetter}
                 </div>
                 <div >
                    <h1 className="font-bold text-xl"> {user?.name}</h1>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                 </div>
                
            </div>
          < div className="border-b">
           <div className="flex items-center gap-4  p-6 cursor-pointer" onClick={()=>navigate('/orders')}>
             <HiMiniCircleStack className="h-5 w-5 text-blue-600" />
             <span className="text-medium font-bold">Your Orders</span>
           </div>
          </div>

          < div className="border-b">
           <div className="flex items-center gap-4  p-6 cursor-pointer" onClick={()=>navigate('/address')}>
             <HiMapPin  className="h-5 w-5 text-blue-600" />
             <span className="text-medium font-bold">Your Addresses</span>
           </div>
          </div>

          < div className="border-b">
           <div className="flex items-center gap-4  p-6 cursor-pointer" onClick={logOutHandler}>
             <TbLogout2  className="h-5 w-5 text-blue-600" />
             <span className="text-medium font-bold">LogOut</span>
           </div>
          </div>


           

            
        </div>

    </div>
  )
}

export default Account