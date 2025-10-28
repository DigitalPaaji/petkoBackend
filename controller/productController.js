import { genteratSlug } from "../helper/generateSlug.js";
// import ColorProduct from "../model/productColor.js";
import Product from "../model/productModel.js";
import mongoose from "mongoose";
import fs from "fs"
import path from "path";



const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      description,
       sku,
        brand,
      price,
      comparePrice,
      costPrice,
     
      quantity,
      trackQuantity,
      allowBackorder,
      lowStockAlert,
      petcategory,
      productcategory,
      tags,
     
      // hasVariants,
      // variants,
      // options,
      weight,
      dimensions,
      isShippingRequired,
      seo,
      status,
      isFeatured,
    } = req.body;


    const productSlug = genteratSlug(name)


    
    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res
          .status(400)
          .json({ success: false, message: "SKU already exists" });
      }
    }

    if (!petcategory || !productcategory) {
      return res.status(400).json({
        success: false,
        message: "Both petcategory and productcategory are required",
      });
    }

    const images = req.files ? req.files.map(img => img.filename) : [];
    console.log(req.files)

    const newProductData = {
      name,
      slug: productSlug,
      description,
      shortDescription,
      price,
      comparePrice, 
      costPrice,
      sku,
      quantity,
      trackQuantity,
      allowBackorder,
      lowStockAlert,
      petcategory,
      productcategory,
      tags:JSON.parse(tags),
      brand,
      images,
     
      weight :JSON.parse(weight),
      dimensions:JSON.parse(dimensions),
      isShippingRequired,
      seo:JSON.parse(seo),
      status,
      isFeatured,
    };

  



    const newProduct = new Product(newProductData);
    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating product",
      error: error.message,
    });
  }
};



export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("productcategory", "product_name") 
      .populate("petcategory", "name type")         
      .sort({ createdAt: -1 });               

    res.status(200).json({
      success: true,
       products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);

    res.status(500).json({
      success: false,
      error: "Failed to fetch products.",
    });
  }
};

 


export const getProductByslug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug })
      .populate("productcategory", "product_name")
      .populate("petcategory", "name type");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

 return    res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
      error: error.message,
    });
  }
};



export const updateProduct = async (req, res) => {
  const { slug } = req.params;

  try {
    const {
       name,
      shortDescription,
      description,
      sku,
      brand,
      price,
      comparePrice,
      costPrice,
      quantity,
      trackQuantity,
      allowBackorder,
      lowStockAlert,
      petcategory,
      productcategory,
      tags,
      weight,
      dimensions,
      isShippingRequired,
      seo,
      status,
      isFeatured,
      imagesToDelete
    } = req.body;

    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Validate category and pet IDs
    if (productcategory && !isValidObjectId(productcategory)) {
      return res.status(400).json({ error: "Invalid category ID." });
    }

    if (petcategory && !isValidObjectId(petcategory)) {
      return res.status(400).json({ error: "Invalid pet ID." });
    }

  
let newImages= []
 

if (imagesToDelete && imagesToDelete.length) {
  // Keep only images not being deleted
  newImages = product.images.filter(item => !imagesToDelete.includes(item));

  for (const item of imagesToDelete) {
    const imgPath = path.join(process.cwd(), "uploads", item);
    try {
      await fs.promises.unlink(imgPath);
      console.log(`🗑️ Deleted old image: ${item}`);
    } catch (err) {
      console.warn(`⚠️ Could not delete image ${item}:`, err.message);
    }
  }
} else {
  newImages = product.images;
}


  
if(req.files){
  req.files.forEach(element => {
    newImages.push(element.filename)
  });
}

   

 

    if (name && name.trim() !== product.name) {
    product.name= name.trim();
      product.slug = genteratSlug(name); 
    }



      const safeParse = (val) => {
      if (!val) return val;
      try {
        return JSON.parse(val);
      } catch {
        return val; // if plain text, return as-is
      }
    };

    product.shortDescription = shortDescription ?? product.shortDescription;
    product.description = description ?? product.description;
    product.sku = sku ?? product.sku;
    product.brand = brand ?? product.brand;
    product.price = price ?? product.price;
    product.comparePrice = comparePrice ?? product.comparePrice;
    product.costPrice = costPrice ?? product.costPrice;
    product.quantity = quantity ?? product.quantity;
    product.trackQuantity = trackQuantity ?? product.trackQuantity;
    product.allowBackorder = allowBackorder ?? product.allowBackorder;
    product.lowStockAlert = lowStockAlert ?? product.lowStockAlert;
    product.petcategory = petcategory ?? product.petcategory;
    product.productcategory = productcategory ?? product.productcategory;
    product.tags = safeParse(tags) ?? product.tags;
    product.weight =safeParse(weight) ?? product.weight;
    product.dimensions = safeParse(dimensions) ?? product.dimensions;
    product.isShippingRequired = isShippingRequired ?? product.isShippingRequired;
    product.seo =safeParse(seo) ?? product.seo;
    product.status = status ?? product.status;
    product.isFeatured = isFeatured ?? product.isFeatured;

    product.images = newImages;





    const updatedProduct = await product.save();


    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ error: "Server error." });
  }
};



export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Delete banner image
   

    // Delete gallery images
    for (const img of product.images) {
      const imgPath = path.join(process.cwd(),"uploads", img);
      if (fs.existsSync(imgPath)) {
        await fs.promises.unlink(imgPath);
      }
    }

    // Delete product from DB
    await product.deleteOne();

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ error: "Failed to delete product." });
  }
};



export const froentProduct = async (req, res) => {
  try {
    const { sort, page = 1, limit = 10,pet, minPrice, maxPrice } = req.query;

    let sortQuery = {};
    switch (sort) {
      case "new":
        sortQuery = { createdAt: -1 };
        break;
      case "lowtohigh":
        sortQuery = { price: 1 };
        break;
      case "hightolow":
        sortQuery = { price: -1 };
        break;
      case "alpha":
        sortQuery = { name: 1 };
        break;
      default:
        sortQuery = {};
        break;
    }

    // Convert page & limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Calculate skip value
    const skip = (pageNum - 1) * limitNum;
    const filter = {};


      if (pet) {
      filter.petcategory = pet; // assuming pet is stored as ObjectId or String in Product model
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Fetch total count for pagination info
    const totalProducts = await Product.countDocuments(filter);

    // Fetch paginated & sorted products
    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);






    return res.status(200).json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalProducts / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const searchProduct= async(req,res)=>{
  try {
     const {searchproduct}= req.params;
       if (!searchproduct) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

  const searchData = await Product.find({
      name: { $regex: searchproduct, $options: "i" },
    }).select("name slug");


    if (searchData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }


    return res.status(200).json({
      success: true,
      products: searchData,
    });



  } catch (error) {

      return res.status(500).json({
      success: false,
      message: "Failed to search products",
      error: error.message,
    });
    
  }
}


