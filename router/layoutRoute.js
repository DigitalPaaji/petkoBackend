import express from "express";
import { createLayout, getAllLayout, getDashboardData, getOrderAnalytics, setActive } from "../controller/layoutController.js";
import uploads from "../helper/uploadImg.js";
const route = express.Router();

route.post("/create",uploads.single("logo"),createLayout);
route.get("/",getAllLayout)
route.put("/active/:id",setActive)

route.get("/dashboard",getDashboardData)
route.get("/analytics/orders",getOrderAnalytics)


export default  route;