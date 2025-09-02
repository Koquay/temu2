const mongoose = require("mongoose");

const { ObjectId, Number } = mongoose.Schema.Types;

const OrdersSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,    
  },
    deliveryAddress: {
      firstName: String,
      lastName: String,
      phone: String,
      address1: String,
      address2: String,
      useAsBillingAddress: Boolean,
  },

  cart: [
    {
      product: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        color: String,
        size: String,
        qty: Number,
        img: String,
      },
      
  ]

});

mongoose.model("Order", OrdersSchema, "orders");

