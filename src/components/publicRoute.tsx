import { AppData } from "../context/AppContext"
import { Navigate, Outlet } from "react-router-dom"

export const  PublicRoute=()=>{
    const {isAuth,loading}=AppData()
    if(loading) return null
    return isAuth ?<Navigate to='/'/>:<Outlet/>
}