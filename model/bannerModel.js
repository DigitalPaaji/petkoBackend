import mongoose from "mongoose";

  const bannerSchema =   new  mongoose.Schema({
     pcimg:{
        type:String,
        required:true
     },
     phoneimg:{
        type:String,
        required:true
     }
},{timestamps:true})


const Banner = mongoose.model("banner",bannerSchema);


export default Banner;