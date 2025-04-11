import { Route, Routes } from "react-router"
import Home from "./components/home"
import Login from "./components/auth/login"
import FarmerLogin from "./components/farmer/login"
import VendorLogin from "./components/vendor/login"
import Signup from "./components/auth/signup"
import FarmerDashboard from "./components/farmer/dashboard"
import Inventory from "./components/farmer/Inventory"
import Orders from "./components/farmer/orders"
import SalesInsight from "./components/farmer/salesinsight"
import Payment from "./components/farmer/payment"
import Queries from "./components/farmer/queries"
import Settings from "./components/farmer/settings"
import EditProduct from "./components/farmer/editproduct"
import VendorDashboard from "./components/vendor/dashboard"
import VendorProfile from "./components/vendor/profile"
import VendorCart from "./components/vendor/cart"
import VendorChatBot from "./components/vendor/chatbot"
import VendorMessage from "./components/vendor/message"
import Vegetable from "./components/vendor/product/vegetable"
import Fruit from "./components/vendor/product/fruit"
import Seed from "./components/vendor/product/seed"
import Leaves from "./components/vendor/product/leaves"
import Fibre from "./components/vendor/product/fibre"
import Grain from "./components/vendor/product/grain"
import Spice from "./components/vendor/product/spice"
import Rice from "./components/vendor/product/rice"
import ProductDetails from "./components/vendor/productDetails"
import MyOrders from "./components/vendor/myOrders"
import Chat from "./components/vendor/chatpage"
import FarmerChat from "./components/farmer/farmerchat"
import FarmerSignup from "./components/farmer/signup"
import VendorSignup from "./components/vendor/signup"
import PaymentPage from "./components/vendor/paymentProcess"
import BuyNow from "./components/vendor/buynow"
import OrderSuccess from "./components/vendor/ordersuccess"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/farmerlogin" element={<FarmerLogin />} />
      <Route path="/vendorlogin" element={<VendorLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/farmersignup" element={<FarmerSignup />} />
      <Route path="/vendorsignup" element={<VendorSignup />} />
      <Route path="/farmerdashboard" element={<FarmerDashboard />} />
      <Route path="/farmer/inventory" element={<Inventory />} />
      <Route path="/farmer/orders" element={<Orders />} />
      <Route path="/farmer/sales" element={<SalesInsight />} />
      <Route path="/farmer/payment" element={<Payment />} />
      <Route path="/farmer/queries" element={<Queries />} />
      <Route path="/farmer/settings" element={<Settings />} />
      <Route path="/product/edit" element={<EditProduct />} />
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/profile" element={<VendorProfile />} />
      <Route path="/vendor/cart" element={<VendorCart />} />
      <Route path="/vendor/chatbot" element={<VendorChatBot />} />
      <Route path="/vendor/message" element={<VendorMessage />} />
      <Route path="/vendor/vegetable" element={<Vegetable />} />
      <Route path="/vendor/fruit" element={<Fruit />} />
      <Route path="/vendor/seeds" element={<Seed />} />
      <Route path="/vendor/leaves" element={<Leaves />} />
      <Route path="/vendor/fibre" element={<Fibre />} />
      <Route path="/vendor/grains" element={<Grain />} />
      <Route path="/vendor/spices" element={<Spice />} />
      <Route path="/vendor/rice-wheat" element={<Rice />} />
      <Route path="/vendor/product/details" element={<ProductDetails />} />
      <Route path="/vendor/myorders" element={<MyOrders />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="/chat/farmer/:conversationId" element={<FarmerChat />} />
      <Route path="/vendor/payment/process" element={<PaymentPage/>}/>
      <Route path="/vendor/buynow/process" element={<BuyNow/>}/>
      <Route path="/vendor/order/success" element={<OrderSuccess/>}/>
    </Routes>
  )
}


export default App

