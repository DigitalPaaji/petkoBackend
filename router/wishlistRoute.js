import express from "express";
import { verifyUser } from "../middlewere/userMiddlewere.js";
import { addToWishlist, clearWishlist, getWishlist, removeFromWishlist } from "../controller/user/wishlistController.js";
const router = express.Router();

router.put("/add/:productid",verifyUser,addToWishlist)
router.put("/remove/:productid",verifyUser,removeFromWishlist)
router.get("/getwishlist",verifyUser,getWishlist)
router.delete("/removewishlist",verifyUser,clearWishlist)



export default router;