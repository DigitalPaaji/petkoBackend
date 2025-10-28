import express from "express";
import { createProduct, deleteProduct, froentProduct, getAllProducts, getProductByslug, searchProduct, updateProduct } from "../controller/productController.js";
import uploads from "../helper/uploadImg.js";
const route = express.Router();

route.get("/allproducts",froentProduct) 



route.post("/create",uploads.array("images",10),createProduct);
 
route.get("/search/:searchproduct",searchProduct)


route.get("/",getAllProducts)


route.get("/:slug",getProductByslug) 

 
route.put("/edit/:slug",uploads.array("images",10),updateProduct)
route.delete("/:id",deleteProduct) 




export default route;



