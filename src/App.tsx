import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Address from "./pages/Address";
import { ProtectedRoute } from "./components/protectedRoute";
import { PublicRoute } from "./components/publicRoute";
import SelectRole from "./pages/selectRole";
import Cart from "./pages/cart";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Layout from "./components/Outlet";
import { AppData } from "./context/AppContext";
import RestaurantPage from "./pages/RestaurantPage";
import UserRestaurantPage from "./pages/UserRestaurantPage";
import Checkout from "./pages/checkout";
import Paymentsuccess from "./pages/paymentsuccess";
import Ordersuccess from "./pages/ordersuccess";
import OrderDetails from "./pages/orderDetails";
import RiderDashboard from "./components/RiderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
const App = () => {
  const { user } = AppData();

  if (user && user.role === "restaurant Owner") {
    return <RestaurantPage />;
  }
    if (user && user.role === "delivery Partner") {
    return <RiderDashboard />;
  }

   if (user && user.role === "admin") {
    return <AdminDashboard />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/ordersuccess" element={<Ordersuccess />} />
<Route
              path="/paymentsuccess/:paymentId"
              element={<Paymentsuccess />}
            />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/selected-role" element={<SelectRole />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/restaurant/:id" element={<UserRestaurantPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/address" element={<Address />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orderdetail/:orderId" element={<OrderDetails/>}/>
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;