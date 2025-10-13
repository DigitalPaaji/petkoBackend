import mongoose from "mongoose";

    const colorProductSchema=  new mongoose.Schema({
    color:{
        type:String
    },
    instock:{
      type: Boolean,
      default: true,
    },
     stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    oldprice: {
      type: Number,
      required: true,
    },

    productid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    }

   
},{timestamps:true})


const ColorProduct= mongoose.model("colorproduct",colorProductSchema);

export default ColorProduct