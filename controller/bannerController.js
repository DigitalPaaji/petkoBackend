import path from "path";
import Banner from "../model/bannerModel.js";
import fs from "fs";

export const createBanner = async (req, res) => {
  try {
    const { count } = req.body;
    const image = req.file?.filename;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }


    if (count) {
      const existingBanner = await Banner.findOne({ count });

      if (existingBanner) {
        existingBanner.count = null;
        await existingBanner.save();
      }
    } 


     await Banner.create({
      image,
      count: count || null,
    });

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error", 
      error: error.message,
    });
  }
};


export const getslidBanner = async (req, res) => {
  try {
    const banners = await Banner.find({ count: null });

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

    const imgPath = path.join(process.cwd(), "uploads", banner.image);
    try {
      await fs.promises.unlink(imgPath);
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


