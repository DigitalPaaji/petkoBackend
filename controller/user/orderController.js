import { json } from "express";
import OrderItem from "../../model/orderitemModel.js";
import Order from "../../model/orderModel.js";



const createOrder = async (req,res)=>{
    try {
    
   const {items,shippingaddress,subtotal,shippingCost,tax,discount,total,notes} = req.body;
   const user = req.user

 if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items found" });
    }

const orderItems= await OrderItem.insertMany(items);




    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


 const newOrder = await Order.create({
      orderNumber,
      user:user._id,
      items: orderItems.map((item) => item._id),
      shippingaddress,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      notes,
    });


return  res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });



    } catch (error) {
        return  res.status(500).json({ success: false, message: error.message });

    }
}

const getOrder=async(req,res)=>{
  try {
  const user = req.user;

  const userOrder = await Order.find({user:user_id});
    




  return res.json({json:userOrder,success:true});
  } catch (error) {
    
  }
}



const cancellOrder=async(req,res)=>{
try {
  const {cancellationReason,orderid}= req.body;
  const user = req.user;
  const order = await Order.find({user:user._id,_id:orderid});
 

  order.status= "cancelled";
  order.cancellationReason = cancellationReason;
   await order.save();

} catch (error) {
  
}
}



