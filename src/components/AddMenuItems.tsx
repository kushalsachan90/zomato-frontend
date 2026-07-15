import { useState } from "react"
import { RestaurantService } from "../main";

import {toast}from "react-hot-toast";
import { BiUpload } from "react-icons/bi";
import api from "../api/axios";
 interface fetchRestaurantProp{
  onItemAdded:()=>void
 }

const AddMenuItems = ({onItemAdded}:fetchRestaurantProp) => {
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const[price,setPrice]=useState('');
    const[file,setFile]=useState <File|null>(null);
    const[loading,setLoading]=useState(false);

    const resetForm=()=>{
        setName("");
        setDescription("");
        setPrice("");
        setFile(null);
   
    }
 
    const handleSubmit=async ()=>{
          if(!name||!price||!file){
            alert("name, Price and file is required")
            return 
          }

          const formData=new FormData();

          formData.append("name",name);
          formData.append("description",description);
          formData.append("price",price);
          formData.append("file",file);
           try {
                setLoading(true);
               await api.post(`${RestaurantService}/api/menuItem/add-item`,formData,{
                headers:{
                 Authorization:`Bearer ${localStorage.getItem("token")}`
                }
               })
        resetForm()
        onItemAdded()
               toast.success("item added successfully")
           
    

           } catch (error) {
             console.log(error)
             toast.error("failed to add item")
           }
           finally{
            setLoading(false)
           }

    } 

  return (
    <div className="max-w-sm space-y-6 m-auto">
        <h2 className="font-bold text-xl text-red-600">Add Menu Item</h2>

            <input type="text" placeholder="Enter Item name" 
             value={name}
             onChange={(e)=>setName(e.target.value)}
             className="w-full rounded-lg border px-4  py-2 text-sm outline-none"
            />
              <textarea  placeholder="Enter description" 
             value={description}
             onChange={(e)=>setDescription(e.target.value)}
             className="w-full rounded-lg border px-4  py-2 text-sm outline-none"
            />

            <input type="number" placeholder="Enter price" 
             value={price}
             onChange={(e)=>setPrice(e.target.value)}
             className="w-full rounded-lg border px-4  py-2 text-sm outline-none"
            />
            <label className="cursor-pointer flex items-center rounded-lg border p-4 text-sm text-gray-600 gap-3  hover:bg-gray-400">
               <BiUpload className="h-5 w-5 text-red-500"/>

               {file?file.name:"upload item image"}
             <input type="file" 
            
             onChange={(e)=>setFile(e.target.files?.[0]||null)}
             className="w-full rounded-lg border px-4  py-2 text-sm outline-none " hidden
            />
          </label> 
                 
              
                <button onClick={handleSubmit} className=" w-full text-white bg-red-500 rounded-md bg-green p-2 " disabled={loading}>{loading?"Adding...":"Add Item"}</button>  
    </div>        
  )    
}
       
export default AddMenuItems  


   
       