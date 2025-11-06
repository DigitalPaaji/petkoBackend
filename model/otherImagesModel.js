import mongoose from "mongoose";

  const otherImagesModelSchema =    mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    count:{
        type:Number,
        enum:[1,2,3,4]
    },
    
  },{timestamps:true})


  const OtherImages = mongoose.model("otherimages",otherImagesModelSchema)

  export default OtherImages;