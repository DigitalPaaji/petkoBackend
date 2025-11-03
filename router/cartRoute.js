import express from "express";
import { verifyUser } from "../middlewere/userMiddlewere.js";
import { addCartItem, addToCart, deleteItem, getCartItem, subCartItem } from "../controller/user/cartController.js";
const router = express.Router();



router.post("/addtocart",verifyUser,addToCart)
router.put("/add/:id",verifyUser,addCartItem)
router.put("/sub/:id",verifyUser,subCartItem)
router.delete("/:id",verifyUser,deleteItem)
router.get("/getcartitem",verifyUser,getCartItem)


export default router
