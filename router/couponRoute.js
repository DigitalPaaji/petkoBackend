import express from "express";
import { createCoupon, deleteCoupon, getallCouponcode, updateStatus } from "../controller/couponController.js";
const route = express.Router();


route.post("/create",createCoupon)
route.get("/allcode",getallCouponcode)
route.put("/status/:couponid",updateStatus)
route.delete("/:id",deleteCoupon)


export default route;



