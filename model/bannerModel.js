import mongoose from "mongoose";

  const bannerSchema =   new  mongoose.Schema({
    image:{
      type:String,
      required:true,
    },
    count:{
      type:Number,
      default:null
    },
    showbanner:{
      type:Boolean,
      default:true
    }
},{timestamps:true})


const Banner = mongoose.model("banner",bannerSchema);


export default Banner;