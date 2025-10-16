import express from "express";
import { createUser, deleteUser, editStatus, getAllUser, login, logout } from "../controller/all/userController.js";
const router = express.Router();

router.post("/signup",createUser)
router.get("/all",getAllUser)
router.post("/signin",login)
router.get("/logout",logout)
router.delete("/delete/:id",deleteUser)
router.put("/status/:id",editStatus)



export default router;