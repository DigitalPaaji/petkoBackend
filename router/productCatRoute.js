import express from "express";
import uploads from "../helper/uploadImg.js";
import { getProducts, productCatCreate } from "../controller/productCatController.js";
const route = express.Router();

route.post("/create",uploads.single("image"),productCatCreate)
route.get("/",getProducts)

export default route


