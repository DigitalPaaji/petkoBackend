import express from "express";
import { createLayout, getAllLayout, setActive } from "../controller/layoutController.js";
import uploads from "../helper/uploadImg.js";
const route = express.Router();

route.post("/create",uploads.single("logo"),createLayout);
route.get("/",getAllLayout)
route.put("/active/:id",setActive)




export default  route;