import express from "express";
import { createCharges, deleteCharges, getCharge } from "../controller/chargesController.js";
const route = express.Router();

route.post("/create",createCharges)
route.get("/",getCharge)
route.delete("/:chargeid",deleteCharges)

export default route


