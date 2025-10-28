import Blog from "../model/blogModel.js";
import Layout from "../model/layoutModel.js";
import Message from "../model/messageModel.js";
import PatCat from "../model/petCatModel.js";
import ProductCat from "../model/productCatModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";

export const createLayout = async (req, res) => {
  try {
    const { email1, email2, number1, number2, address, links, layoutcolor } = req.body;
    const file = req.file;

    if (!email1 || !number1 || !address) {
      return res.status(400).json({
        success: false,
        message: "Email1, Number1, and Address are required.",
      });
    }

    const layoutData = {
      logo: file ? file.path : null, 
      email1,
      email2,
      number1,
      number2,
      address,
      layoutcolor,
    };

   if (typeof links === "string") {
      try {
        layoutData.links = JSON.parse(links); 
      } catch {
        return res.status(400).json({
          success: false,
          message: "Links must be a valid JSON array of objects.",
        });
      }
    } else if (Array.isArray(links)) {
      layoutData.links = links;
    } else {
      layoutData.links = [];
    }

    if (layoutData.active) {
      await Layout.updateMany({}, { $set: { active: false } });
    }

    const newLayout = await Layout.create(layoutData);

    return res.status(201).json({
      success: true,
      message: "Layout created successfully.",
      data: newLayout,
    });

  } catch (error) {
    console.error("Error creating layout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};



export const getAllLayout = async (req, res) => {
  try {
    // 1️⃣ Fetch all layouts, optionally sort by newest first
    const layouts = await Layout.find().sort({ createdAt: -1 });

    // 2️⃣ Check if any layouts exist
    if (!layouts || layouts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No layouts found.",
        data: [],
      });
    }

    // 3️⃣ Return layouts
    return res.status(200).json({
      success: true,
      message: "Layouts fetched successfully.",
      count: layouts.length,
      data: layouts,
    });

  } catch (error) {
    console.error("Error fetching layouts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


export const setActive = async (req, res) => {
  try {
    const { id } = req.params;

    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Layout ID is required.",
      });
    }

    const layout = await Layout.findById(id);
    if (!layout) {
      return res.status(404).json({
        success: false,
        message: "Layout not found.",
      });
    }

    await Layout.updateMany({}, { $set: { active: false } });

    layout.active = true;
    await layout.save();

    return res.status(200).json({
      success: true,
      message: `Layout "${layout._id}" is now active.`,
    
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};



export const getDashboardData=async(req,res)=>{
  try {
    
const message = await Message.find().select("read");
const users = await User.countDocuments();
const PatCategory = await PatCat.countDocuments()
const productCategory = await ProductCat.countDocuments();
const product = await Product.countDocuments();
 const blog =await Blog.find();





return res.json({success:true,message,users,PatCategory,productCategory,product,blog})
  } catch (error) {
    
  }
}


 

