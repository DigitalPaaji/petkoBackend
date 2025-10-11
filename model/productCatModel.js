import mongoose from 'mongoose';

const productCatSchema = new mongoose.Schema({
  product_name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Product name is required']
  },
  img: {
    type: String,
    trim: true
    // You can optionally validate if it's a URL here
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'petcategories', // This should match the model name, not necessarily the collection name
    required: [true, 'Pet category (petId) is required']
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Slug is required']
  }
}, { timestamps: true });

 const ProductCat= mongoose.model('ProductCategory', productCatSchema);

 export default ProductCat
