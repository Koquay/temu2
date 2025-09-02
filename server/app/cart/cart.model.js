const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema(
  {
    user: {
    type: ObjectId,
    ref: "User",
    required: true,    
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
  },
  {
    timestamps: true,
  }
);

mongoose.model("Cart", CartSchema, 'cart');


