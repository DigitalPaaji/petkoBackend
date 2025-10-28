import express from "express";
import { createUser, deleteUser, editStatus, getAllUser, getUser, login, logout, sendOtp } from "../controller/all/userController.js";
import { verifyUser } from "../middlewere/userMiddlewere.js";
const router = express.Router();

router.post("/signup",createUser)
router.get("/all",getAllUser)
router.post("/signin",login)
router.get("/logout",logout)
router.delete("/delete/:id",deleteUser)
router.put("/status/:id",editStatus)
router.post("/sendotp",sendOtp)
router.get("/getuser",verifyUser,getUser)


export default router;