import  express from "express";
import { createPatCat, deletPetCat, getAllpetcat } from "../controller/petCatController.js";
import uploads from "../helper/uploadImg.js";
const route = express.Router();

route.post("/create",uploads.single("image"),createPatCat)
route.get("/",getAllpetcat)
route.delete("/:id",deletPetCat);








export default route;
