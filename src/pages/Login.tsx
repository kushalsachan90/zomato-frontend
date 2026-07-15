import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import api from "../api/axios";
import {toast} from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';

import ZwigatoWelcome from '../component2/design'
import LoginPage from '../component2/logindesing'
import { AppData } from "../context/AppContext";
const Login = () => {
 const [loading,setloading] = useState(false);
 const navigate=useNavigate();
 const { setIsAuth, fetchUser } = AppData();
const responseGoogle=async(authResult:{ code: string })=>{
  setloading(true);
 
 try {
   const result= await api.post(`${authService}/api/authroute/login`,{
    code:authResult["code"]
   })

  
   localStorage.setItem("refreshToken",result.data.refreshToken);

 const { data: refreshData } = await api.post(`${authService}/api/authroute/refresh`, {
    refreshToken: result.data.refreshToken
});
localStorage.setItem("token", refreshData.accessToken);

     await fetchUser();
   setIsAuth(true);

   toast.success(result.data.message); 
   setloading(false);
   navigate("/")
 } catch (error) {
  console.log(error);
  toast.error("problem while login")
  setloading(false);
 }
}
const handleError = () => {   
  toast.error("Google login failed");
};
const googleLogin=useGoogleLogin({
  onSuccess:responseGoogle,
  onError:handleError,
  flow:"auth-code"

})
return (
  <div className="flex  w-full overflow-hidden h-full">
    
    {/* Left Half */}
    <div className="flex-1 flex items-center justify-center overflow-hidden">
      <ZwigatoWelcome />
    </div>

    {/* Right Half */}
    <div className="flex-1 flex items-center justify-center overflow-hidden h-full" >
      <LoginPage googleLogin={googleLogin} loading={loading}/>
    </div>

  </div>
);



    
  
}

export default Login   