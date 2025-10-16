import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products", 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    colorprodutid:{
         type: mongoose.Schema.Types.ObjectId,
      ref: "colorproduct", 
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity cannot be less than 1"], // ✅ Add validation
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { timestamps: true }
);

// ✅ Optional: ensure a user can't have the same product twice in cart
cartSchema.index({ userId: 1, colorprodutid: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
