import express from "express";
import { getAdmin, loginAdmin, logoutAdmin, signupAdmin } from "../controller/adminController.js";
import { verifyAdmin } from "../middlewere/adminMiddlewere.js";
const route = express.Router();
 
route.post("/signup",signupAdmin);
route.post("/login",loginAdmin)
route.get("/getadmin",verifyAdmin,getAdmin)
route.get("/logout",verifyAdmin,logoutAdmin)



export default  route





