import express from "express";
import uploads from "../helper/uploadImg.js";
import { createBanner, createOtherBanner, deleteBanner, getAllBanner, getCountBanner, getOtherBanner, getslidBanner, toggleShow } from "../controller/bannerController.js";
const router = express.Router();

router.post("/create",uploads.fields([
    { name: "desktop", maxCount: 1 },
    { name: "mobile", maxCount: 1 },
  ]),createBanner)



router.get("/",getslidBanner);
router.get("/count",getCountBanner)
router.delete("/delete/:bannerid",deleteBanner)
router.put("/togglebanner/:bannerId",toggleShow)
router.get("/allbanner",getAllBanner)


router.post("/otherbanner",uploads.single("image"),createOtherBanner)
router.get("/otherbanners",getOtherBanner)





export default  router


