import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity cannot be less than 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
 