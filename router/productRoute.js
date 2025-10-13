import express from "express";
import { createProduct, getAllProducts, getProductByslug, updateProduct } from "../controller/productController.js";
import uploads from "../helper/uploadImg.js";
const route = express.Router();
route.post("/create",uploads.fields([
  { name: "banner_image", maxCount: 1 },
  { name: "images", maxCount: 10 }
]),createProduct)

route.get("/",getAllProducts)
route.get("/:slug",getProductByslug) 
route.put("/edit/:slug",uploads.fields([
  { name: "banner_image", maxCount: 1 },
  { name: "images", maxCount: 10 }
]),updateProduct)


export default route;



