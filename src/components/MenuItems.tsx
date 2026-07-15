


import { type IMenuItem } from "../types";
import { useState } from "react";
import { CgEye } from "react-icons/cg";
import { TbEyeOff } from "react-icons/tb";
import { BiSolidCart, BiTrash } from "react-icons/bi";
import { BiLoader } from "react-icons/bi";
import api from "../api/axios";
import { RestaurantService } from "../main";
import toast from "react-hot-toast";
import { AppData } from "../context/AppContext";

interface MenuItemProp {
  menuItems: IMenuItem[];
  isSeller: boolean;
  onItemDeleted: () => void;
  onStatusupdated:()=>void;
}



const MenuItems = ({ menuItems, isSeller, onItemDeleted ,onStatusupdated}: MenuItemProp) => {
  const [loadingItemId, setloadingItemId] = useState<string | null>(null);

  const toggleAvailabity = async (ItemId: string) => {
    try {
      const { data } = await api.put(
        `${RestaurantService}/api/menuItem/status/${ItemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
   onStatusupdated();
      toast.success(data.message);
    } catch (error:any) {
      console.log(error);
      toast.error(error)
    }
  };

  const handleDelete = async (ItemId: string) => {
    const confirm = window.confirm("are you sure you want to delete item");
    if (!confirm) return;

    try {
      await api.delete(
        `${RestaurantService}/api/menuItem/delete${ItemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onItemDeleted();
      toast.success("Item deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const {fetchCart}=AppData();

const AddToCart=async(restaurantId:string,itemId:string)=>{
  try {
     setloadingItemId(itemId);
     const {data}=await api.post(`${RestaurantService}/api/cart/add`,{restaurantId,itemId},{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
     })
     console.log(data,"hi")
       toast.success("Item added successfully");
  fetchCart();
  } catch (error) {
    console.log(error);
    toast.error("Error in adding Item")
  }
finally{
  setloadingItemId(null)
}

}

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {menuItems.map((item) => {
        const isloading = loadingItemId === item._id;

        return (
          <div
            key={item._id}
            className={`relative flex gap-4 rounded-lg bg-white shadow-sm transition ${
              !item.isAvailable ? "opacity-70" : ""
            }`}
          >
            {/* IMAGE SECTION ONLY CHANGED */}
            <div className="relative">
              <img
                src={item.image}
                alt="pizza image"
                className={`h-20 w-20 rounded ${
                  !item.isAvailable ? "grayscale" : ""
                }`}
              />

              {!item.isAvailable && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded bg-black/50">
                  <span className="text-[10px] font-semibold text-white">
                    Not Available
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-500">{item.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="font-semibold">₹{item.price}</p>

                {isSeller && (
                  <div className="flex gap-5">
                    <button
                      onClick={() => {
                        toggleAvailabity(item._id);
                      }}
                      className="rounded-lg text-gray-600 hover:bg-gray-200 p-2"
                    >
                      {item.isAvailable ? (
                        <CgEye size={18} />
                      ) : (
                        <TbEyeOff size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        handleDelete(item._id);
                      }}
                      className="rounded-lg text-red-700"
                    >
                      <BiTrash size={18} />
                    </button>
                  </div>
                )}

                {!isSeller && (
                  <button
                    disabled={!item.isAvailable || isloading}
                    onClick={() => AddToCart(item.restaurantId,item._id)}
                    className={`flex items-center justify-center rounded-lg p-2 ${
                      !item.isAvailable || isloading
                        ? "cursor-not-allowed text-gray-400"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    {isloading ? (
                      <BiLoader size={18} className="animate-spin" />
                    ) : (
                      <BiSolidCart size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuItems;