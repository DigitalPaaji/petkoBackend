import express from "express";
import { verifyUser } from "../middlewere/userMiddlewere.js";
import { addToCartRemovetowishlist, addToWishlist, clearWishlist, getAllWishListItem, getWishlist, moveTowishlist } from "../controller/user/wishlistController.js";
const router = express.Router();

router.put("/add/:productid",verifyUser,addToWishlist)
// router.put("/remove/:productid",verifyUser,removeFromWishlist)
router.get("/getwishlist",verifyUser,getWishlist)
router.delete("/removewishlist",verifyUser,clearWishlist)
router.post("/addtowish",verifyUser,moveTowishlist)
router.get("/allwishlistitem",verifyUser,getAllWishListItem)
router.post("/addtocart/remove",verifyUser,addToCartRemovetowishlist)

export default router;