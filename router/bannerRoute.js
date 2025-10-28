import express from "express";
import uploads from "../helper/uploadImg.js";
const router = express.Router();

router.post("/add",uploads.fields([
    {name:"pcimg",maxCount:1},
        {name:"phoneimg",maxCount:1}

]))




export default  router


