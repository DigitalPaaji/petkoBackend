import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import PetCatRoute from "./router/petCatRoute.js"
import ProductCatRoute from "./router/productCatRoute.js"
import ProductRoute from "./router/productRoute.js"




import path from "path";
import cors from "cors"
dotenv.config();



const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // 👈 specific origin, not "*"
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use("/uploads",express.static(path.join(process.cwd(),"uploads")));



app.use("/v1/petcat",PetCatRoute)
app.use("/v1/productcat",ProductCatRoute)
app.use("/v1/product",ProductRoute)










const PORT = process.env.PORT || 8001;
  
mongoose.connect(process.env.URL).then(()=>{
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})
})

