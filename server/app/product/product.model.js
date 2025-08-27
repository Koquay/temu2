const mongoose = require("mongoose");
const { ObjectId, Number } = mongoose.Schema.Types;

const SubCategorySchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  img: String
}, { _id: true }); // <--- ensures subdocuments have _id



const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  categories: [SubCategorySchema]

});

mongoose.model("Category", CategorySchema, "categories");



const ProductSchema = new mongoose.Schema({
  category: {
    type: ObjectId,
    ref: "Category",
    required: true,    
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
  },
  rating: {
    type: String,
  },
  specifications: [],
  
  images: [ ],

});

mongoose.model("Product", ProductSchema, "products");
ProductSchema.index({ name: "text" });