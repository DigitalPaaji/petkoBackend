import { genteratSlug } from "../helper/generateSlug.js";
import ColorProduct from "../model/productColor.js";
import Product from "../model/productModel.js";
import mongoose from "mongoose";
import fs from "fs"
import path from "path";
// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      details,
      colors,
      categoryid,
      petid,
      meta_title,
      meta_description
    } = req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const slug = genteratSlug(title);

    // Check for duplicates
    const existingTitle = await Product.findOne({ title });
    if (existingTitle) {
      return res.status(400).json({ error: "Product title already exists." });
    }

    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ error: "Slug already exists." });
    }


    if (categoryid && !isValidObjectId(categoryid)) {
      return res.status(400).json({ error: "Invalid category ID." });
    }

    if (petid && !isValidObjectId(petid)) {
      return res.status(400).json({ error: "Invalid pet ID." });
    }

    // Handle files
    const bannerImageFile = req.files?.banner_image?.[0];
    const galleryImageFiles = req.files?.images || [];

    if (!bannerImageFile) {
      return res.status(400).json({ error: "Banner image is required." });
    }

    const banner_image = bannerImageFile.filename;
    const images = galleryImageFiles.map((file) => file.filename);

    // Create Product
    const product = new Product({
      banner_image,
      meta_title,
      meta_description,
      title: title.trim(),
      slug: slug.trim(),
      images,
      description,
      details,
      categoryid,
      petid,
    });

    const savedProduct = await product.save();

    // Handle color variants if provided
    if (colors ) {
      const parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;



      await Promise.all(
        parsedColors.map((item) =>
            ColorProduct.create({
            color: item.color,
            instock: item.instock ?? true,
            stock: item.stock ?? 0,
            price: item.price,
            oldprice: item.oldprice,
            productid: savedProduct._id,
          })
        )
      );
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ error: "Server error." });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryid", "product_name") // only fetch product_name
      .populate("petid", "name type")         // only fetch relevant pet fields
      .sort({ createdAt: -1 });               // sort latest first

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
      .populate("categoryid", "product_name")
      .populate("petid", "name type");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const colorVariants = await ColorProduct.find({ productid: product._id });

    res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: {
        product,
        colors: colorVariants,
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
      title,
      description,
      details,
      colors,
      categoryid,
      petid,
      meta_title,
      meta_description,
    } = req.body;

    const existingProduct = await Product.findOne({ slug });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Validate category and pet IDs
    if (categoryid && !isValidObjectId(categoryid)) {
      return res.status(400).json({ error: "Invalid category ID." });
    }

    if (petid && !isValidObjectId(petid)) {
      return res.status(400).json({ error: "Invalid pet ID." });
    }

    // Handle image files
    const bannerImageFile = req.files?.banner_image?.[0];
    const galleryImageFiles = req.files?.images || [];

    if (bannerImageFile) {
      const oldBannerPath = path.join(process.cwd(), "uploads", existingProduct.banner_image);
      try {
        await fs.promises.unlink(oldBannerPath);
      } catch (err) {
        console.warn("Failed to delete old banner image:", err.message);
      }
      existingProduct.banner_image = bannerImageFile.filename;
    }

    if (galleryImageFiles.length > 0) {
      // Delete existing gallery images
     await Promise.all(
  existingProduct.images.map(async (filename) => {
    const imagePath = path.join(process.cwd(), "uploads", filename);
    try {
      await fs.promises.unlink(imagePath);
    } catch (err) {
      console.warn("Failed to delete gallery image:", err.message);
    }
  })
);

      // Add new gallery images
      const newGalleryImages = galleryImageFiles.map((file) => file.filename);
      existingProduct.images = newGalleryImages;
    }

    // Update main fields
    if (title && title.trim() !== existingProduct.title) {
      existingProduct.title = title.trim();
      existingProduct.slug = genteratSlug(title); // Regenerate slug if title changes
    }

    existingProduct.description = description ?? existingProduct.description;
    existingProduct.details = details ?? existingProduct.details;
    existingProduct.categoryid = categoryid ?? existingProduct.categoryid;
    existingProduct.petid = petid ?? existingProduct.petid;
    existingProduct.meta_title = meta_title ?? existingProduct.meta_title;
    existingProduct.meta_description = meta_description ?? existingProduct.meta_description;

    // Save updated product
    const updatedProduct = await existingProduct.save();

    // Update color variants
    if (colors) {
      const parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;

      // Delete old color variants
      await ColorProduct.deleteMany({ productid: existingProduct._id });

      // Create new ones
      await Promise.all(
        parsedColors.map((item) =>
          ColorProduct.create({
            color: item.color,
            instock: item.instock ?? true,
            stock: item.stock ?? 0,
            price: item.price,
            oldprice: item.oldprice,
            productid: existingProduct._id,
          })
        )
      );
    }

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
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product." });
  }
};
