import { useNavigate } from "react-router-dom";

interface RestaurantCardProp{
    id:string;
    image:string;
    name:string;
    distance:string;
    isOpen:boolean;

}

const RestaurantCard = ({id,image,name,distance,isOpen}:RestaurantCardProp) => {
    const navigate=useNavigate()
  return (
    <div className={`cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md  ${!isOpen ?"opacity-80":""}`} onClick={()=>navigate(`/restaurant/${id}`)}>
           <div className="relative h-40 overflow-hidden w-full">
            <img src={image} alt="restaurant_image" className={`h-full w-full object-cover transition duration-300 hover:scale-105 ${!isOpen?"grayscale":""}`} />
             {

                !isOpen &&(
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="text-sm font-semibold rounded-md bg-black/80 px-3 py-1 text-white ">closed</span>
                    </div>
                )
             }

           </div>
           <div className="px-3 py-2">
            <h3 className="font-bold text-xl text-orange-600">{name}</h3>
            <p className="text-gray-500">{distance} Km away</p>
           </div>
    </div>
  )
}

export default RestaurantCard