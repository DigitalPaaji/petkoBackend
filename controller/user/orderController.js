import Coupon from "../../model/couponModel.js";
import Order from "../../model/orderModel.js";
import Product from "../../model/productModel.js";


export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      addressId,
      paymentMethod,
      couponCode,
      shippingPrice,
      taxPrice
    } = req.body;
 const user= req.user;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items found",
      });
    }
    let itemsPrice = 0;
    for (const item of orderItems) {
      itemsPrice += item.price * item.quantity;
    }

    let coupon = null;
    let discountAmount = 0;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode, isActive: true });
   
      if (coupon) {
        if (itemsPrice >= coupon.minPurchaseAmount) {
          if (coupon.discountType === "percentage") {
            discountAmount = (itemsPrice * coupon.discountValue) / 100;
          } else {
            discountAmount = coupon.discountValue;

          }

          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;

          }

        }
        coupon.usedCount++
        await coupon.save()
      }
    }

  
    const totalPrice =itemsPrice + Number(shippingPrice) + Number(taxPrice) - discountAmount;

    const order = await Order.create({
      user:user._id,
      orderItems,
      shippingAddress:addressId,
      paymentMethod: paymentMethod || "COD",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      coupon: coupon
        ? {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount,
          }
        : undefined,
    });










    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllorder = async (req, res) => {
  try {
    const { filter, payment } = req.query;

    let query = {};

    if (filter && ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(filter)) {
      query.orderStatus = filter;
    }


    if (payment !== undefined) {
      query.isPaid = payment === "true"; 
    }

    // Fetch orders
    const getOrder = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("orderItems.product", "name price images")
      .populate("shippingAddress");

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: getOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};



export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
 
    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};


export const changeVale = async (req, res) => {
  try {
    const { orderid, status } = req.body;

    

    if (!orderid || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }

let order;

    if(status=="Delivered"){

 order = await Order.findByIdAndUpdate(
      orderid,
      { orderStatus: status ,
        isDelivered:true,
        deliveredAt: Date.now()
      },
      { new: true } )

    }
    else if(  status=="Cancelled"){

       order = await Order.findByIdAndUpdate(
      orderid,
      { orderStatus: status },
      { new: true } 
    );
    }
else{
 order = await Order.findByIdAndUpdate(
      orderid,
      { orderStatus: status ,
                isDelivered:false,
        deliveredAt: null


      },
      { new: true } 
    );
    }
   

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




export const changepayment= async (req, res) => {
  try {
    const { orderid, isPaid } = req.body;

    

    if (!orderid ) {
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }

let order

if(isPaid){
  order =await Order.findByIdAndUpdate(
      orderid,
      { isPaid,
        
        paidAt: Date.now()
      },
      { new: true } )

    }else{
       order =await Order.findByIdAndUpdate(
      orderid,
      { isPaid,
        
        paidAt: null
      },
      { new: true } )
    }
   

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order paid updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};










