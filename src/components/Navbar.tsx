import { AppData } from "../context/AppContext"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { CgShoppingCart } from "react-icons/cg"
import { BiMapPin, BiSearch } from "react-icons/bi"
export const Navbar=()=>{
    const {isAuth,city}=  AppData();
    const currentLocation=useLocation();
    const isHomePage=currentLocation.pathname==='/'
    const[searchParams,setSearchParams]=useSearchParams()
    const[search,setSearch]=useState(searchParams.get('search') || '')
    const  {quantity}=AppData();
    useEffect(()=>{
        const timer=setTimeout(()=>{
            if(search){
                setSearchParams({search})
            }else{
                setSearchParams({})
            }
        },500)
        return ()=>{
            clearTimeout(timer)
        }
    },[search]);
    return (
        <div className="w-full bg-white shadow-sm">
            <div className="mx-auto max-w-7xl flex items-center justify-between py-3 px-4">
                <Link to='/' className="text-3xl font-bold text-red-600 cursor-pointer">
                    Zwigato
                </Link>

                <div className="flex items-center gap-4">
                    <Link to='/cart' className="relative">
                    <CgShoppingCart className=" text-3xl font-bold text-red-600" />
                                         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">{quantity}</span>
                    </Link>
                   {
                    isAuth?<Link to="/account" className="text-lg font-bold text-red-600">Account</Link>:null
                   }

                </div>
            </div>
            {/* {searchBar} */}
            {
                isHomePage && <div className="border-t px-4 py-3">
                    <div className="mx-auto flex max-w-7xl items-center rounded-lg border shadow-sm ">
                        <div className="flex items-center gap-2 px-3 border-r text-gray-700 py-1">
                            <BiMapPin className="h-6 w-6 text-red-600" />
                            <span className="text-sm truncate">{city}</span>
                        </div>

                        <div className="flex flex-1 items-center gap-2 px-3">
                            <BiSearch className="h-6 w-6 text-gray-700"/>
                            <input type="text" value={search}  onChange={(e)=>setSearch(e.target.value)} placeholder="Search for restaurant, cuisine or a dish" className="flex-1 border-none focus:ring-0 text-sm outline-none" />
                            </div> 


                    </div>
                </div>
            }
        </div>
    )
}