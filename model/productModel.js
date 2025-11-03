import mongoose  from "mongoose";


const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
    minlength: [2, 'Product name must be at least 2 characters']
  },
  slug:{
   type: String,
    required: [true, 'Product name is required'],
    trim: true,
    unique:true
  }, 
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
   brand: {
    type: String,
    trim: true
  },
  
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
    sku: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    match: [/^[A-Z0-9-_]+$/, 'SKU can only contain letters, numbers, hyphens, and underscores']
  },
    
  // Pricing
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
   
  },
  
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
    validate: {
      validator: function(value) {
        return value >= this.price;
      },
      message: 'Compare price must be greater than or equal to regular price'
    }
  },
  
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },



  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },

  trackQuantity: {
    type: Boolean,
    default: true
  },
  
  allowBackorder: {
    type: Boolean,
    default: false
  },
  
  lowStockAlert: {
    type: Number,
    default: 10,
    min: [0, 'Low stock alert cannot be negative']
  },
  
  petcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'petcategories',
    required: [true, 'Pat category is required']
  },
  
  productcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
        required: [true, 'Product category is required']

  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
 
  
  images: {
    type :[String],
   default: [] },
 
 
  
  weight: {
    value: {
      type: Number,
      min: 0,
      default:0
    },
    unit: {
      type: String,
    enum: [
  'g',    
  'kg',    // kilograms
  'mg',    // milligrams
  'ml',    // millilitres
  'l',     // litres
  'oz',    // ounces
  'lb',    // pounds
  'pack',  // for packaged goods
  'piece', // single item
  'pcs',   // plural of piece
  'dozen', // eggs, bakery, etc.
  'pair',  // shoes, gloves
  'set',   // bundled products
  'm',     
  'cm',    
  'mm',   
  'sqm',   // square metres (tiles, flooring)
  'box',   
  'bottle',
  'can',
  'tube',
  'roll',
  'sheet',
  'bag',
  'carton'
],

      default: 'g'
    }
  },
  
  dimensions: {
    length: { type: Number, min: 0 ,default:0 },
    width: { type: Number, min: 0 ,default:0},
    height: { type: Number, min: 0,default:0 },
    unit: {
      type: String,
      enum: ['cm', 'm', 'in', 'ft'],
      
    }
  },
  
  isShippingRequired: {
    type: Boolean,
    default: true 
  },
  
 
  seo: {
    title: {
      type: String,
      maxlength: [60, 'SEO title cannot exceed 60 characters'],
      default:""
    },
    description: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
      default:""
    },
    
    canonicalUrl: {type:String ,default:""}
  }, 
  
  
  status: {
    type: String,
    enum: ['active', 'draft', 'archived', 'out_of_stock'],
    default: 'draft'
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  

  
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  


 view: {
      type: Number,
      default: 0,
      min: 0
    },
     ordercount: {
      type: Number,
      default: 0,
      min: 0
    },



  
}, {
  timestamps: true,
 
});





const Product = mongoose.model('Product', productSchema);

 export default  Product;














