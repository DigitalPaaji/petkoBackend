import { genteratSlug } from "../helper/generateSlug.js";
import  ProductCat  from "../model/productCatModel.js";
import fs from "fs"
import path  from "path";


export const productCatCreate= async(req,res)=>{
    try {
    const { cat, petId } = req.body;
    const file = req.file;

    if (!cat || !petId || !file) {
      return res.status(400).json({ error: 'cat, petId, and image file are required.' });
    }

    const slug = genteratSlug(cat);

    const newProduct = await ProductCat.create({
      product_name: cat,
      img: file.filename, // or file.path depending on how you store it
      petId,
      slug
    });

    return res.status(201).json({
      message: 'Product category created successfully.',
      data: newProduct
    });

  } catch (error) {
    console.error('Error creating product category:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }

}

export const getProducts = async (req, res) => {
  try {
    // Fetch all products and populate related pet category if needed
    const allProductCat = await ProductCat.find()
      .populate('petId', 'type img') // Populate pet category fields (optional)
      .sort({ createdAt: -1 });      // Latest first

    return res.status(200).json({
      success: true,
      message: 'Product categories fetched successfully.',
      data: allProductCat
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product categories.',
      error: error.message
    });
  }
}


export const deleteProductCat= async(req,res)=>{
  try {
const {id}= req.params;

const getProduct= await ProductCat.findById(id);
if (!getProduct) {
      return res.status(404).json({success:false, message: 'Product category not found' });
    }

const imgpath =  path.join(process.cwd(),"uploads",getProduct.img);

   await fs.promises.unlink(imgpath);

   await ProductCat.deleteOne({_id:id});
   
    return res.status(200).json({success:true, message: 'Product category deleted successfully' });


    
  } catch (error) {
        return res.status(500).json({success:false, message: 'Server error while deleting product category' });

    
  }
}






