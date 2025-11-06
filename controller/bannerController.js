import path from "path";
import Banner from "../model/bannerModel.js";
import fs from "fs";
import OtherImages from "../model/otherImagesModel.js";

export const createBanner = async (req, res) => {
  try {


        const imagedesktop = req.files.desktop ? req.files.desktop[0].filename : null;
    const imagemobile = req.files.mobile ? req.files.mobile[0].filename : null;



     await Banner.create({
      imagedesktop,
      imagemobile
    });

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: "Internal Server Error", 
      error: error.message,
    });
  }
};


export const getslidBanner = async (req, res) => {
  try {
    const banners = await Banner.find({show :true});

    return res.status(200).json({
      success: true,
      message: "Banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};







export const getAllBanner = async (req, res) => {
  try {
    const banners = await Banner.find({});

    return res.status(200).json({
      success: true,
      message: "Banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};





export const getCountBanner = async (req, res) => {
  try {
    // Find all banners where count is not null and sort by count ascending
    const banners = await Banner.find({ count: { $ne: null } }).sort({ count: 1 });

    return res.status(200).json({
      success: true,
      message: "Banners with count fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error fetching count banners:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



export const deleteBanner = async (req, res) => {
  try {
    const { bannerid } = req.params;

    if (!bannerid) {
      return res.status(400).json({
        success: false,
        message: "Banner ID is required",
      });
    }

    const banner = await Banner.findById(bannerid);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const imagedesktop = path.join(process.cwd(), "uploads", banner.imagedesktop);
        const imagemobile = path.join(process.cwd(), "uploads", banner.imagemobile);

    try {
      await fs.promises.unlink(imagedesktop);
            await fs.promises.unlink(imagemobile);

    } catch (err) {
      console.warn("⚠️ Image not found or already deleted:", imgPath);
    }

    await banner.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const toggleShow = async (req, res) => {
  try {
    const { bannerId } = req.params;

    // Find the banner by ID
    const banner = await Banner.findById(bannerId);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Toggle the show property
    banner.show = !banner.show;
    await banner.save();

    return res.status(200).json({
      success: true,
      message: "Banner visibility toggled successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while toggling banner visibility",
      error: error.message,
    });
  }
};






 export const createOtherBanner = async (req, res) => {
  try {
    const { count } = req.body;
if(!count){
   return res.status(400).json({
        success: false,
        message: "Count is required",
      });
}


    if (!req.file || !req.file.filename) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const image = req.file.filename;
   const allreadyBanner= await OtherImages.findOne({count});

   if(allreadyBanner){
   const imgpath =  path.join(process.cwd(),"uploads",allreadyBanner.image);
   fs.promises.unlink(imgpath);
     await allreadyBanner.deleteOne()
   }





    const newBanner = await OtherImages.create({
      image,
      count: count,
     
    });

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: newBanner,
    });
  } catch (error) {
    console.error("Error creating other banner:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating banner",
      error: error.message,
    });
  }
};



export const getOtherBanner = async (req, res) => {
  try {
    // Fetch all other banners (latest first)
    const banners = await OtherImages.find().sort({count :1});

    return res.status(200).json({
      success: true,
      message: "Banners fetched successfully",
      data: banners,
    });
  } catch (error) {
    console.error("Error fetching other banners:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching banners",
      error: error.message,
    });
  }
};

export const deleteOtherBanner = async (req, res) => {
  try {
    const { bannerid } = req.params;

    // Find the banner first
    const banner = await OtherImages.findById(bannerid);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // Delete the image file if it exists
    const imgPath = path.join(process.cwd(), "uploads", banner.image);

    try {
      await fs.promises.unlink(imgPath);
    } catch (fsErr) {
      console.warn("File not found or already deleted:", imgPath);
      // Continue anyway; file missing is not critical
    }

    // Delete the banner record from MongoDB
    await banner.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting other banner:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting banner",
      error: error.message,
    });
  }
};



 