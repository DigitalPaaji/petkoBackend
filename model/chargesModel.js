import mongoose from "mongoose";

   const chargesSchema =   mongoose.Schema( {
    chargetype: {
      type: String,
      enum: ["tax", "shipping"],
      required: true,
      unique:true
    },
    chargeamount: {
      type: Number,
      required: true,
      default: 0,
    },
    maxvalue: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true });

   const Charges= mongoose.model("charges",chargesSchema)


   export default Charges;
