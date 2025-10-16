import { compairPassword, passwordHashing } from "../../helper/hanshing.js";
import { createToken } from "../../helper/tokenJWT.js";
import User from "../../model/userModel.js";

 export  const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (name, email, password) are required." 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already registered." 
      });
    }

    // Hash password
    const hashedPassword = await passwordHashing(password);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });


        const userId = user._id;

const token =  createToken(userId)


res.cookie("user_token", token, {
 path:'/',
        httpOnly:true,
        expires: new Date(Date.now()+ 1000 *60 *60 * 24 * 70),
        sameSite:'none',
      secure:true,
})    

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error." 
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 3️⃣ Check password
    const isPasswordMatch = await compairPassword(password,user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4️⃣ Create JWT token
    const token = createToken(user._id);

    // 5️⃣ Set token in secure HTTP-only cookie
    res.cookie("user_token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 70), 
      sameSite: "none",
      secure: true,
    });

    // 6️⃣ Send success response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
     
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const logout= async(req,res)=>{
  res.cookie("user_token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true, 
    });
     return res.status(200).json({
      success: true,
      message: "Logout successful",
      
    });
}


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // 2️⃣ Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 3️⃣ Delete user
    await User.deleteOne({ _id: id });

    // 4️⃣ Send success response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const editStatus =async(req,res)=>{
  try {

const {id}= req.params;
const {status}= req.body
 if (!id || typeof status === "undefined") {
      return res.status(400).json({
        success: false,
        message: "User ID and status are required.",
      });
    }

const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 3️⃣ Update status
    user.status = status;
    await user.save();



 return res.status(200).json({
      success: true,
      message: "User status updated successfully.",
      
    });

    
  } catch (error) {
    
return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  }
}






