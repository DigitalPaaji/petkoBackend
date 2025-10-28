import express from "express";
import { addViewBlog, createBLog, deleteBlog, getAllBlogs, getblog, getTop5, togglePublishBlog } from "../controller/blogController.js";
import uploads from "../helper/uploadImg.js";
const route = express.Router();




route.post("/create",uploads.array("images"),createBLog)
route.get("/",getAllBlogs)
route.get("/topblog",getTop5)

route.get("/:slug",getblog)
route.put("/update/:id",togglePublishBlog)
route.put("/addview/:slug",addViewBlog)
route.delete("/:id",deleteBlog)




export default route