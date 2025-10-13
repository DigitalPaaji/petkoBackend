import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    banner_image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    images: [String],
  
    
    description: {
      type: String,
      default: "",
    },
    details: [String],
    
    categoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
    },
    petid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "petcategories",
    },
views:{
 type: Number,
 default: 0,   
}
,



meta_title: {
      type: String,
      trim: true,
    },

meta_description: {
      type: String,
      trim: true,
    },


  },
  { timestamps: true }
);

const Product = mongoose.model("products", productSchema);

export default Product;
