import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import PetCatRoute from "./router/petCatRoute.js"
import ProductCatRoute from "./router/productCatRoute.js"
import ProductRoute from "./router/productRoute.js"
import LayoutRoute from "./router/layoutRoute.js"
import AdminRoute from "./router/adminRoute.js"
import BlogRoute from "./router/blogRoute.js"
import couponRoute from "./router/couponRoute.js"
import bannerRoute from "./router/bannerRoute.js"
import chargesRoute from "./router/chargesRoute.js"
import UserRoute from "./router/userRoute.js"
import MessageRoute from "./router/messageRoute.js"
import CartRoute from "./router/cartRoute.js"
import AddressRoute from "./router/addressRoute.js"
import WishlistRoute from "./router/wishlistRoute.js"
import checkoutRoute from "./router/checkoutRoute.js"
import orderRoute from "./router/orderRoute.js"








import path from "path";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config();



const app = express();
app.use(express.json());
app.use(cors({
  origin: [process.env.FROENTEND], 
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser())


app.use("/uploads",express.static(path.join(process.cwd(),"uploads")));





app.get("/",async(req,res)=>{
  return res.json({success:true})
})



app.use("/v1/petcat",PetCatRoute)
app.use("/v1/productcat",ProductCatRoute)
app.use("/v1/product",ProductRoute)
app.use("/v1/layout",LayoutRoute)
app.use("/v1/admin",AdminRoute)
app.use("/v1/blog",BlogRoute)
app.use("/v1/coupon",couponRoute)
app.use("/v1/banner",bannerRoute)
app.use("/v1/charges",chargesRoute)




app.use("/v1/user",UserRoute)
app.use("/v1/message",MessageRoute)


 
app.use("/v1/cart",CartRoute)
app.use("/v1/address",AddressRoute)
app.use("/v1/wishlist",WishlistRoute)
app.use("/v1/checkout",checkoutRoute)
app.use("/v1/order",orderRoute)











const PORT = process.env.PORT || 8001;
  
mongoose.connect(process.env.URL).then(()=>{
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})
})







