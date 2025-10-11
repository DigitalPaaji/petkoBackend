import PatCat from "../model/petCatModel.js";
import fs from "fs";
import path from "path";
import { genteratSlug } from "../helper/generateSlug.js";
   
export const createPatCat = async (req, res) => {
  try {
    const { cat } = req.body;
    const file = req.file;

    if (!cat) {
      return res.status(400).json({ error: "Cat type is required." });
    }

    if (!file || !file.path) {
      return res.status(400).json({ error: "Image file is required." });
    }

  const slug= genteratSlug(cat)

    const newCat = await PatCat.create({
      type: cat,
      img: file.path  ,
      slug
    });

    return res.status(201).json({
      message: "Pet cat created successfully.",
      data: newCat
    });

  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong while creating pet cat.",
      details: error.message
    });
  }
};

export const getAllpetcat=async(req,res)=>{
    try {

const petCategory= await PatCat.find();

if(!petCategory){
    return res.status(400).json({success:false,message:"Category not found"})
}

   return res.status(200).json({
    success:true,petCategory
   })



        
    } catch (error) {
         return res.status(500).json({
      error: "Something went wrong while creating pet cat.",
      details: error.message
    }); 
    }
}

export const deletPetCat=async(req,res)=>{
  try {
    const {id} = req.params;
    
    const petcatFind = await PatCat.findOne({_id:id});
    const fullPath = path.join(process.cwd(), petcatFind.img);



     await fs.promises.unlink(fullPath);
     await PatCat.deleteOne({ _id: id });


          return res.status(200).json({success:true, message: 'deleted successfully' ,petcatFind});



  } catch (error) {
        return res.status(500).json({success:false, error: 'Server error' });
  }
}



 



