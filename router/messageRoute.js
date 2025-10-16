import express from "express";
import { createMessage, deleteMessage, getAllMessage, seenMessage } from "../controller/all/messageController.js";
const route= express.Router();


route.post("/create",createMessage)
route.get("/allmessage",getAllMessage)
route.delete("/:id",deleteMessage)
route.put("/seen/:id",seenMessage)


export default route
