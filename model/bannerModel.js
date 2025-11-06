import mongoose from "mongoose";
import { type } from "os";

  const bannerSchema =   new  mongoose.Schema({
    imagedesktop:{
      type:String,
      required:true,
    },
     imagemobile:{
      type:String,
      required:true,
    },
     show:{
      type:Boolean,
      default:true
     }
    


},{timestamps:true})


const Banner = mongoose.model("banner",bannerSchema);


export default Banner;