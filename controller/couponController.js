import Coupon from "../model/couponModel.js";


export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      validTill,
      usageLimit,
      perUserLimit,
      usedCount
    } = req.body;

    if (!code || !discountType || discountValue === undefined || !validTill) {
      return res.status(400).json({
        success: false,
        message: "Code, discount type, discount value, and validTill are required",
      });
    }



    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = new Coupon({
      code,
      description,
      discountType,
      discountValue,
      minPurchaseAmount: minPurchaseAmount || 0,
      maxDiscountAmount: maxDiscountAmount || 0,
      validTill,
      usageLimit: usageLimit || 1,
      perUserLimit: perUserLimit || 1,
      usedCount: usedCount || 0,
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Create Coupon Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating coupon",
      error: error.message,
    });
  }
};


export const getallCouponcode = async (req, res) => {
  try {
    const allCoupons = await Coupon.find().sort({ isActive: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: allCoupons,
    });
  } catch (error) {
    console.error("Get All Coupons Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching coupons",
      error: error.message,
    });
  }
};


export const updateStatus = async (req, res) => {
  try {
    const { couponid } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive field is required in the request body",
      });
    }

    const updatedCoupon = await Coupon.findOneAndUpdate(
      { _id: couponid },
      { isActive },
      { new: true } 
    );

    if (!updatedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating coupon status",
      error: error.message,
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the coupon
    const deletedCoupon = await Coupon.findOneAndDelete({ _id: id });

    if (!deletedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

   return   res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting coupon",
      error: error.message,
    });
  }
};


