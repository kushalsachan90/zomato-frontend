

import { AppData } from "../context/AppContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute=()=>{
    const {isAuth,loading,user}=AppData();
      const location =useLocation();
      console.log("data:",user)
            console.log("loading",loading)
    if(loading ) return null;
   

    if(!user&&!isAuth){
        return <Navigate to="/login" />
    }
  

    if(!user?.role &&location.pathname!=='/selected-role'){
        return <Navigate to='/selected-role' />
    }
    if(user?.role &&location.pathname==='/selected-role'){
        return <Navigate to='/' />
    }

    return <Outlet />;
}
