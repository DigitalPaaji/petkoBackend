import path from "path";
import { genteratSlug } from "../helper/generateSlug.js";
import Blog from "../model/blogModel.js";
import fs from "fs"

  
  export const createBLog=async(req,res)=>{

    try {
const {
      title,
      tag,
      description,
      author,
      readingTime,
      sections,
    } = req.body;  
    
  let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename); 
    }
         
           if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and Description are required",
      });
    }

    const slug = genteratSlug(title);

const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: "A blog with the same title already exists",
      });
    }


    const newBlog = await Blog.create({
      title,
      slug,
      images,
      tag: tag || "General",
      description,
      author: author || "Anonymous",
      readingTime: readingTime || 3,
      sections:  JSON.parse( sections) || [],
          });



  return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });





    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
    }






}





export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



export const getblog= async(req,res)=>{
  try {
const {slug} = req.params
    const blog = await Blog.findOne({slug})
    return res.status(200).json({
      success: true,
    
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }  
}



export const togglePublishBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.published = !blog.published;
    await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog has been ${blog.published ? "published" : "unpublished"}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while toggling blog status",
      error: error.message,
    });
  }
};



export const addViewBlog= async(req,res)=>{
  try {
const {slug} = req.params
    const blog = await Blog.findOne({slug})
       if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();
    return res.status(200).json({
      success: true,
    
     
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }  
}


export const getTop5 = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(5).select("images title updatedAt tag slug description");

    // const tags = await Blog.distinct("tag", { tag: { $ne: null, $ne: "" } });

    return res.status(200).json({
      success: true,
      
      blogs,
      // tags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};



export const deleteBlog = async(req,res)=>{
    try {
         const {id}= req.params;
          const blog = await Blog.findOne({_id:id})
       if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }



    blog.images.forEach(image => {
      const imgpath =  path.join(process.cwd(),image);
          fs.promises.unlink(imgpath);
      
    });
   


    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });

    } catch (error) {
        
    }
}


