import mongoose from "mongoose";

const orderItemSchems = new mongoose.Schema(
  {
    productid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: [true, "Product is required"],
    },
    colorproductid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colorproduct",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
  },
  { timestamps: true }
);

const OrderItem = mongoose.model("orderitem", orderItemSchems);

export default OrderItem;




