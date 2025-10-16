import { verifyToken } from "../helper/tokenJWT.js";
import User from "../model/userModel.js";

export const verifyUser = async (req, res, next) => {
  try {
    const { user_token } = req.cookies;

    // 1️⃣ Check if token exists
    if (!user_token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // 2️⃣ Verify token
    const decoded = verifyToken(user_token);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // 3️⃣ Find user
    const user = await User.findById(decoded).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 4️⃣ Attach user to request (useful for protected routes)
    req.user = user;

    // 5️⃣ Optionally send response or continue middleware chain
    // return res.status(200).json({
    //   success: true,
    //   message: "User verified successfully.",
    //   data: user,
    // });

    // 👉 or call next() if you want this to be a true middleware:
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
