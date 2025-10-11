import mongoose from "mongoose";

const petCatSchema = new mongoose.Schema({
  type: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  img: {
    type: String,
    trim: true
  },
  slug:{
    type:String,
    unique:true
  }

}, { timestamps: true });




 const PatCat = mongoose.model("petcategories",petCatSchema)

 export default PatCat;

