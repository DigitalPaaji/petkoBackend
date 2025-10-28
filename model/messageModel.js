import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
    },
    email:{
        type:String,
        trim:true
    },
    number:{
type:String,},
message:{
    type:String
},
read:{
type:Boolean,
default:false
}

},{timestamps:true})

const Message= mongoose.model("message",messageSchema);
export default  Message