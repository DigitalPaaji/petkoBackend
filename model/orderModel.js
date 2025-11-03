import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String }, 
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});





const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "PayPal", "Stripe"],
      default: "COD",
    },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, default: 0 }, 
    totalPrice: { type: Number, required: true },

    coupon: {
      code: { type: String },
      discountType: { type: String, enum: ["percentage", "fixed"] },
      discountValue: { type: Number },
      discountAmount: { type: Number, default: 0 },
    },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date,default:null },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date ,default:null},

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    trackingId: { type: String ,default:null},
    notes: { type: String }, 
  },
  { timestamps: true,default:null }
);








const Order =  mongoose.model("Order", orderSchema);

export default Order;
