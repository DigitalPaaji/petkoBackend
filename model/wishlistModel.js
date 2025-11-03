import mongoose from "mongoose";
 
 const wishlistSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

 productId: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: [true, "Product is required"],
  },  
],

  
},{timestamps:true});








const Wishlist = mongoose.model('Wishlist', wishlistSchema);


export default Wishlist;


