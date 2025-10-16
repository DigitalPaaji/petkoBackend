import mongoose from "mongoose";

const layoutSchema= new mongoose.Schema({
    logo:{
        type:String
    },
     email1:{
        type:String
    },
     email2:{
        type:String
    },
      number1:{
        type:String
    },
     number2:{
        type:String
    },
      address:{
        type:String
    },
     links:[
       
  {
    name: { type: String, required: true },
    url: { type: String, required: true }
  }

     ],
     layoutcolor:{
        type:String
     },
     active:{
        type:Boolean,
        default:false
     }
    
    
},{timestamps:true})

const Layout =  mongoose.model("layout",layoutSchema);
export default Layout;