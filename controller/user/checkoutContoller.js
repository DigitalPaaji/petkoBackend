import Cart from "../../model/cartModel.js";
import Coupon from "../../model/couponModel.js";
import Product from "../../model/productModel.js";



export const getItembyid=async(req,res)=>{
   try {
    const { productid } = req.params;

    if (!productid) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const data = await Product.findById(productid).select("name slug images price comparePrice");

    if (!data) {
      return res.status(200).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product: data,
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}


export const verifyCouponcode = async (req, res) => {
  try {
    const { code, price } = req.body;

    if (!code || !price) {
      return res.status(200).json({
        success: false,
        message: "Coupon code and price are required.",
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(200).json({
        success: false,
        message: "Invalid or inactive coupon code.",
      });
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validTill) {
      return res.status(200).json({
        success: false,
        message: "This coupon is expired or not yet valid.",
      });
    }

    // 🔹 Check minimum purchase
    if (price < coupon.minPurchaseAmount) {
      return res.status(200).json({
        success: false,
        message: `Minimum purchase amount for this coupon is $${coupon.minPurchaseAmount}.`,
      });
    }

if(coupon.usageLimit  <=coupon.usedCount){
return res.status(200).json({
        success: false,
        message: `This coupon is expired or not yet valid.`,
      });
}


    let discountPrice = 0;
    if (coupon.discountType === "percentage") {
      discountPrice = (price * coupon.discountValue) / 100;
    } else {
      discountPrice = coupon.discountValue;
    }

    if (coupon.maxDiscountAmount && discountPrice > coupon.maxDiscountAmount) {
      discountPrice = coupon.maxDiscountAmount;
    }

    


    // ✅ Return success response
    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      discountAmount: discountPrice,
      
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};


export const getItemByCart = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found.",
      });
    }

    // 🔹 Fetch all cart items and populate product details
    const cartItems = await Cart.find({ userId })
      .populate("productId", "name slug images price comparePrice")
      .lean();

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Your cart is empty.",
        data: [],
      });
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      const productPrice = item.productId?.price || 0;
      return sum + productPrice * item.quantity;
    }, 0);

    const totaloldprice = cartItems.reduce((sum, item) => {
      const productPrice = item.productId?.comparePrice || 0;
      return sum + productPrice * item.quantity;
    }, 0);

   


    // 🔹 Send response
    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully.",
      totalAmount,
      data: cartItems,
      totaloldprice,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};






