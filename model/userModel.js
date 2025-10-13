import mongoose from "mongoose";

const userSchema=   new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        min:6,
        required:true,
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})


const User= mongoose.model("users",userSchema);

export default User;
