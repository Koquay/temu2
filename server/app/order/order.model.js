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


// {
//   "_id": {
//     "$oid": "688a3972029a596e6eca94c8"
//   },
//   "cart": [
//     {
//       "productId": {
//         "$oid": "68605d167ff5f635b50b8a0e"
//       },
//       "color": "brown",
//       "size": "12",
//       "qty": 1,
//       "img": "aadffa751c0247df84cf85c7b779c2e4-goods.webp",
//       "_id": {
//         "$oid": "688a3972029a596e6eca94c9"
//       }
//     }
//   ],
//   "userId": {
//     "$oid": "687e7731e707cec094eea602"
//   },
//   "__v": 0
// }