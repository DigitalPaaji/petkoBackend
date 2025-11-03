import express from "express";
import { getItemByCart, getItembyid, verifyCouponcode } from "../controller/user/checkoutContoller.js";
import { verifyUser } from "../middlewere/userMiddlewere.js";
const route = express.Router();

route.get("/getbuyproduct/:productid",verifyUser,getItembyid)
route.get("/getcartproduct",verifyUser,getItemByCart)



route.post("/verifycouponcode",verifyUser,verifyCouponcode)


export default route