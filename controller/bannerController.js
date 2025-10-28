import Banner from "../model/bannerModel.js";




export const createBanner=async(req, res)=>{
  try {
    const pcimg = req.files?.pcimg?.[0];
    const phoneimg = req.files?.phoneimg?.[0];

    if (!pcimg || !phoneimg) {
      return res.status(400).json({
        success: false,
        message: "Both PC and Phone images are required",
      });
    }

    const newBanner = await Banner.create({
      pcimg: pcimg.path || pcimg.filename,
      phoneimg: phoneimg.path || phoneimg.filename,
    });

return res.status(201).json({
      success: true,
      message: "Banner created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};