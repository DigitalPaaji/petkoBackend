import mongoose from "mongoose";
 
 const wishlistSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  items: [
    {
      productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: [true, "Product is required"],
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},{timestamps:true});



wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.addedAt': -1 });


wishlistSchema.methods.addProduct= function(productid){
    if(!this.items.some(item=>item.productid.toString()  === productid.toString()  )){
        this.items.push({productid})
        return this.save();
    }

    return Promise.resolve(this);
}


wishlistSchema.methods.removeProduct=function(productid){
    this.items= this.items.filter(item => item.productid.toString() !==productid.toString() ) ;
    return this.save();

}




wishlistSchema.methods.hasProduct = function(productId) {
  return this.items.some(item => item.productid.toString() === productId.toString());
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);


export default Wishlist;


