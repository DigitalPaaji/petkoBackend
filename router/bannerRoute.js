import express from "express";
import uploads from "../helper/uploadImg.js";
import { createBanner, deleteBanner, getCountBanner, getslidBanner } from "../controller/bannerController.js";
const router = express.Router();

router.post("/create",uploads.single("image"),createBanner)
router.get("/",getslidBanner);
router.get("/count",getCountBanner)
router.delete("/delete/:bannerid",deleteBanner)




export default  router


