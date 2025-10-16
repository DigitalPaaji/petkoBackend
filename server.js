import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import PetCatRoute from "./router/petCatRoute.js"
import ProductCatRoute from "./router/productCatRoute.js"
import ProductRoute from "./router/productRoute.js"
import LayoutRoute from "./router/layoutRoute.js"


import UserRoute from "./router/userRoute.js"
import MessageRoute from "./router/messageRoute.js"


import CartRoute from "./router/cartRoute.js"
import AddressRoute from "./router/addressRoute.js"
import WishlistRoute from "./router/wishlistRoute.js"






import path from "path";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config();



const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", 
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser())


app.use("/uploads",express.static(path.join(process.cwd(),"uploads")));



app.use("/v1/petcat",PetCatRoute)
app.use("/v1/productcat",ProductCatRoute)
app.use("/v1/product",ProductRoute)
app.use("/v1/layout",LayoutRoute)


app.use("/v1/user",UserRoute)
app.use("/v1/message",MessageRoute)



app.use("/v1/cart",CartRoute)
app.use("/v1/address",AddressRoute)
app.use("/v1/wishlist",WishlistRoute)











const PORT = process.env.PORT || 8001;
  
mongoose.connect(process.env.URL).then(()=>{
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})
})







