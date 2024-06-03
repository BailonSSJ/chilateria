const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerNumber: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,  // Debería ser String
      required: true,
    },
    cartItems: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }  // Debería ser timestamps en plural
);

const Bills = mongoose.model("bills", billSchema);

module.exports = Bills;
