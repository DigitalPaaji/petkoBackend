import express from "express";
import { verifyUser } from "../middlewere/userMiddlewere.js";
import { addAddress, getAddress, removeAddress, setDefault, updateAddress } from "../controller/user/addressController.js";
const router= express.Router();


router.post("/create",verifyUser,addAddress)
router.get("/",verifyUser,getAddress)
router.put("/active/:id",verifyUser,setDefault)
router.delete("/delete/:id",verifyUser,removeAddress)
router.put("/update/:id",verifyUser,updateAddress)


export default router;
