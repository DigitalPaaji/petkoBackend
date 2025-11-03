import express from "express";
import uploads from "../helper/uploadImg.js";
import { deleteProductCat, getProductCategory, getProducts, getRandom, productCatCreate } from "../controller/productCatController.js";
const route = express.Router();

route.post("/create",uploads.single("image"),productCatCreate);
route.get("/",getProducts)
route.get("/petcat/:petId",getProductCategory)
route.get("/getRandom",getRandom)


route.delete("/:id",deleteProductCat)

export default route


