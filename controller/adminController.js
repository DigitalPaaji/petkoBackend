import { compairPassword, passwordHashing } from "../helper/hanshing.js";
import { createToken } from "../helper/tokenJWT.js";
import Admin from "../model/adminModel.js";

export const signupAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already registered with this email",
      });
    }

    const hashedPassword = await passwordHashing(password);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Error in signupAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await compairPassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    admin.lastLoginDate = new Date();
    await admin.save();
    const token = createToken(admin._id);

    res.cookie("admin_token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 70),
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAdmin = async (req, res) => {
  const admin = req.admin.lastLoginDate;
  return res.json({ success: true, admin });
};

export const logoutAdmin = async (req, res) => {
  res.cookie("admin_token", "", {
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
};




export const changePassword = async (req, res) => {
  try {
    const { email, password, newEmail, newPassword } = req.body;

    // ✅ Validate input
    if (!email || !password || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, old password, and new password are required",
      });
    }

    // ✅ Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // ✅ Check old password
    const isMatch = await compairPassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // ✅ Hash new password
    const hashedNewPassword = await passwordHashing(newPassword);

    // ✅ Update password (and email if provided)
    admin.password = hashedNewPassword;
    if (newEmail) admin.email = newEmail;

    
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

