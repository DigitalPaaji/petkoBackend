import express from "express";
import { changepayment, changeVale, createOrder, getAllorder, getOrder, trackIDAdd } from "../controller/user/orderController.js";
import { verifyUser } from "../middlewere/userMiddlewere.js";
const router = express.Router();


router.post("/createorder",verifyUser,createOrder)
router.put("/status",changeVale)
router.put("/paid",changepayment)
router.get("/get/allorder",getAllorder)

router.get("/get/order/:id",getOrder)
router.put("/ordertracking",trackIDAdd)


export default router;