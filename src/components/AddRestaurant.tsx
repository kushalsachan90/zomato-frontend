import { useState } from "react";
import { AppData } from "../context/AppContext";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { RestaurantService } from "../main";
import { BiMapPin, BiUpload } from "react-icons/bi";

interface AddRestaurantProps{
    onSuccess:()=>void
}
const AddRestaurant = ({onSuccess}:AddRestaurantProps) => {
const [name,setName]=useState('');
const [description,setDescription]=useState('');
const [phone,setPhone]=useState('');
// const [latitude,setLatitude]=useState('');
// const [longitude,setLongitude]=useState('');
const [file,setFile]=useState<File | null>(null);
const [submitting,setSubmitting]=useState(false);
const {loadingLocation,location}=AppData();



const handleSubmit=async()=>{
    if(!name || !file || !location){
        return alert("name,image and location are required");
    }

    const formData=new FormData();
    formData.append("name",name);
    formData.append("description",description);
    formData.append("phone",phone);
    formData.append("latitude",location.latitude.toString());
    formData.append("longitude",location.longitude.toString());
    formData.append("file",file);
    formData.append("formattedAddress",location.formattedAddress)
   
    
    try{
setSubmitting(true);
await api.post(`${RestaurantService}/api/restaurant/add`,formData,{
    headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
    }
})
toast.success("Restaurant added successfully")
onSuccess();

    }
    catch(error: any){
        toast.error(error.response?.data?.message  )
    }
    finally{
        setSubmitting(false);
    }
}


  return (
   <div className="min-h-screen bg-gray-50 px-4  py-6">
    <div className="mx-auto max-w-lg rounded-xl bg-white shadow-sm p-6  space-y-5 ">
        <h1 className="text-2xl font-bold text-red-900">Add Restaurant</h1>
        <input type="text" placeholder="Restaurant Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full outline-none rounded-lg border border-gray-400 px-4 py-6 text-bold"/>
        <input type="number" placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full outline-none rounded-lg border border-gray-400 px-4 py-6 text-bold"/>

        <textarea  placeholder="Restaurant Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full outline-none rounded-lg border border-gray-400 px-4 py-6 text-bold"/>

    <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-4 text-sm text-gray-600 hover:bg-gray-50">
        <BiUpload className="h-6 w-6 text-red-600"/>
        {file?file.name:"Upload Restaurant Image"}
         <input type="file"  onChange={(e)=>setFile(e.target.files?.[0]||null)} className="w-full outline-none rounded-lg border border-gray-400 px-4 py-6 text-bold hidden"/>
    </label>
            
            <div className="flex items-start gap-3 rounded-lg borderlr p-4">
                <BiMapPin className="h-6 w-6 text-red-600"/>
                <div className="text-sm">{

                    loadingLocation?"Fetching Location...":location?.formattedAddress||"Location not found, please allow location access and refresh the page"
                    }

                </div>
            </div>
        
        <button disabled={submitting || loadingLocation} onClick={handleSubmit} className="w-full bg-red-900 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold">{submitting? "Submitting...":"Add Restaurant"}</button>
    </div>
   </div>
  )
}

export default AddRestaurant
   