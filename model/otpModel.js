import mongoose from "mongoose";

 const otpSchema= new  mongoose.Schema({

otp:{
    type:Number,
match: /^\d{6}$/,
     trim:true,
    required:true
},
email:{
    type:String,
    unique:true,
    trim:true,
    required:true
},

expiresAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },

},{timestamps:true});



const Otp =  mongoose.model("otp",otpSchema);
export default Otp;



