import { verifyToken } from "../helper/tokenJWT.js";
import Admin from "../model/adminModel.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const { admin_token } = req.cookies;

    // 1️⃣ Check if token exists
    if (!admin_token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // 2️⃣ Verify token
    const decoded = verifyToken(admin_token);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // 3️⃣ Find user
    const admin = await Admin.findById(decoded).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "admin not found.",
      });
    }

    req.admin = admin;

    next();

  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
