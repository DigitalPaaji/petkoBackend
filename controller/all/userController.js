import { compairPassword, passwordHashing } from "../../helper/hanshing.js";
import { sendMail } from "../../helper/sendMail.js";
import { createToken } from "../../helper/tokenJWT.js";
import Address from "../../model/addressModel.js";
import Order from "../../model/orderModel.js";
import Otp from "../../model/otpModel.js";
import User from "../../model/userModel.js";




export const sendOtp = async(req,res)=>{
  try {
   const { email } = req.body;

     const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

await Otp.findOneAndDelete({ email });


const otp = Math.floor(100000 + Math.random() * 900000).toString();


  await sendMail(email,otp)
    await Otp.create({email,otp})

return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
     
    });

  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server error",
    });
    
  }
}





 export  const createUser = async (req, res) => {
  try {
    const { name, email, password ,otp} = req.body;



    // Basic validation
    if (!name || !email || !password || !otp || otp.length !=6) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (name, email, password) are required." 
      });
    }


    



    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already registered." 
      });
    }

    const otpuser= await Otp.findOne({email});
    if(!otpuser){
  return res.json({ success: false, message: "OTP not found" });
    }
    if(otpuser.otp != otp){
            return res.json({success:false,message: "inveled otp"})

    }

await otpuser.deleteOne();

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
    return res.status(500).json({
      success: false,
      message: error.message,
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



export const getUser= async(req,res)=>{
  try {
    
    const user = req.user;
    if(!user){
      return res.status(401).json({success:false,message:"login first"})
    }
    








return res.status(200).json({success:true});


  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}


export const userDetails = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Login first to access this resource",
      });
    }

    const addresses = await Address.find({ userid: user._id });
    const orders = await Order.find({ user: user._id }).populate("orderItems.product shippingAddress"); // optional populate

    // Return complete info
    return res.status(200).json({
      success: true,
      user,
      addresses,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { orderid } = req.params;

    const order = await Order.findById(orderid).sort({ createdAt : 1 }).populate("orderItems.product")         
      .populate("shippingAddress");    


    // If no order found
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};











