export interface User{
    _id:string,
    name:string,
    email:string,
    image:string,
    role:string

}

export interface LocationData{
    latitude:number,
    longitude:number,
    formattedAddress:string
}
// types mein bhi add karo
export interface AppContextType {
  // ...baaki sab
  fetchUser: () => Promise<void>;  // ✅ add karo
}

export interface AppContextType{
    user:User |null;
    loading:boolean;
    isAuth:boolean;
    setUser:React.Dispatch<React.SetStateAction<User|null>>;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>;
    setloading:React.Dispatch<React.SetStateAction<boolean>>;
    setquantity:React.Dispatch<React.SetStateAction<number>>
    location:LocationData | null;
    loadingLocation:boolean;
    city:string;
    setLocation:React.Dispatch<React.SetStateAction<LocationData|null>>;
    setCity:React.Dispatch<React.SetStateAction<string>>;
    cart:ICart[] |[];
    setCart:React.Dispatch<React.SetStateAction<ICart[]|[]>>,
    fetchCart:()=>Promise<void>;
    subtotal:number;
    quantity:number

}


export interface IRestaurant {
    _id:string,
    name:string,
    description?:string,
    image:string,
    ownerId:string,
    phone:number,
    isVerified:boolean,
    autoLocation:{
        type:"Point",
        coordinates:[number,number],
        formattedAddress:string
    };
    isOpen:boolean,
    createdAt:Date;

}

export interface IMenuItem{
    _id:string
    name:string,
    description:string,
    image?:string,
    price:number,
    restaurantId:string,
    isAvailable:boolean,
    createdAt:Date,
    updatedAt:Date,



}


export interface ICart {
    _id:string
    userId:string,
    itemId:string |IMenuItem,
    restaurantId:string | IRestaurant,
    quantity:number,
    itemImage:string,
    createdAt:Date,
    updatedAt:Date
}

export interface IOrder {
    _id:string,
    userId:string,
    restaurantId:string,
    restaurantName:string,
    riderId?:string|null,
    riderPhone:number|null,
    riderName:string |null,
     riderdistance:number,
     riderAmount:number,
     
    items:{
        itemId:string
        name:string
        price:number
        quantity:number
    }[];

     subtotal:number
     deliveryFee:number;
     platformFee:number;
      totalAmount:number;
     addressId:string
     deliveryAddress:{
       formattedAddress:string;
       mobileNo:number;
       latitude:number;
       longitude:number
     };


     status:|"placed"|"accepted"| "preparing" |"ready_for_rider"|"rider_assigned"|"picked_up"|"delivered"|"cancelled"

     paymentMethod:"razorpay"|"stripe"

     paymentStatus:"pending"|"paid"|"failed"

     expiresAt:Date;
     createdAt:Date;
     updatedAt:Date;

}
