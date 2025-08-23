require("./product.model");
const Category = require("mongoose").model("Category");
const Product = require("mongoose").model("Product");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

exports.getProduct = async (req, res) => {
  console.log('product.service.getProduct called...');

  const productId = req.params.productId;
  console.log('product.service.productId', productId)

  try {
    const product = await Product.findById(productId)

    console.log('product:', product)
    res.status(200).json(product)
  } catch(error) {
    console.error('Error in getProduct:', error);
    return res.status(500).send({error: 'Error fetching product'});
  }
}

exports.getProducts = async (req, res) => {
    console.log('product.service.getProducts called...');
    const options = req.query.options;
    console.log('product.service.options', options);

    const productCountPipeline = [];

    const aggregatePipeline = buildAggregatePipeline(
        JSON.parse(options),
        productCountPipeline
      );
    
      console.log("aggregatePipeline", JSON.stringify(aggregatePipeline));

      try {
        const products = await Product.aggregate(aggregatePipeline);
        console.log("products", products);
        // const productCount = await getProductCount(productCountPipeline);
        // console.dir("productCount", productCount);
        res.status(200).json(products );
      } catch (error) {
        console.error(error);
        res.status(500).send("Problem getting products.");
      }

}

  

const buildAggregatePipeline = (options, productCountPipeline) => {
    let { category, subcategory, shoeSize, sortOption, color, featuredItem, pageNo, pageSize } =
      options;
  
    console.log("options", options);
  
    let aggregatePipeline = [
      // { $match: { imgs: { $type: "array" } } }
    ];
  
    if(category) {
        let categoryMatch = buildCategoryMatch(category);
        aggregatePipeline.push(categoryMatch);
        productCountPipeline.push(categoryMatch);
    }

    if(subcategory) {
      let subcategoryMatch = buildSubcategoryMatch(subcategory);
      aggregatePipeline.push(subcategoryMatch);
      productCountPipeline.push(subcategoryMatch);
  }

    if(sortOption) {
      let sortMatch = buildSortMatch(sortOption);
      aggregatePipeline.push(sortMatch);
      productCountPipeline.push(sortMatch);
  }

  if(color) {
    let colorMatch = buildColorMatch(color);
    aggregatePipeline.push(colorMatch);
    productCountPipeline.push(colorMatch);
}

  if(shoeSize) {
    let shoeSizeMatch = buildShoeSizeMatch(shoeSize);
    aggregatePipeline.push(shoeSizeMatch);
    productCountPipeline.push(shoeSizeMatch);
}
    
    
    checkForEmptyAggregate(aggregatePipeline);
    // resolveReferences(aggregatePipeline);
  
    return aggregatePipeline;
  };

  const buildCategoryMatch = (category) => {
    return {
      $match: { category: mongoose.Types.ObjectId.createFromHexString(category) }
    };
  };

  const buildSubcategoryMatch = (subcategory) => {
    return {
      $match: { subcategory: mongoose.Types.ObjectId.createFromHexString(subcategory) }
    };
  };
  

  exports.getCategory = async (req, res) => {
    console.log('category.service called...');
    // updateCategories();
    
    try {
        let categories = await Category.find();
        // console.log('categories', categories);
        res.status(200).json(categories)
    } catch(error) {
        console.error('Error in getCategory:', error);
        return res.status(500).send({error: 'Error fetching catetories'});
    }

}

const checkForEmptyAggregate = (aggregatePipeline) => {
    if (aggregatePipeline.length === 0) {
      aggregatePipeline.push({ $match: { _id: { $ne: null } } });
    }
  };

  const buildShoeSizeMatch = (shoeSize) => {
    return {
      $match: {
        sizes: { $in: [shoeSize] }
      }
    };
  };


  const buildColorMatch = (color) => {
    return {
      $match: {
        "colors.name": color
      }
    };
  };
  

  const buildRatingMatch = (ratings) => {
    if (ratings?.length) {
      return { $match: { rating: { $in: ratings } } };
    }
    return null;
  };

  const resolveReferences = (aggregatePipeline) => {
    aggregatePipeline.push(
      {
        $lookup: {
          from: "categories",            // the name of the collection to join
          localField: "category",      // field in the Product collection
          foreignField: "_id",           // field in the Category collection
          as: "category"                 // name of the new array field in the result
        }
      },
      {
        $unwind: "$category"            // flattens the array so you get a single object instead of an array
      }
    )
  }

  const buildSortMatch = (sortOption) => {
    let filter;
    if (sortOption == 'Price High to Low') {
      filter = { $sort: { price: -1 } };
    } else if (sortOption == 'Price Low to High') {
      filter = { $sort: { price: 1 } };
    }  else if (sortOption == 'Rating') {
      filter = { $sort: { rating: -1 } };
    } 
  
    return filter || { $sort: { _id: -1 } };
  };


  exports.searchForProducts2 = async (req, res) => {
    console.log("ProductsServicer.searchProducts");
  
    const searchField = req.query.searchField;
    console.log("searchField", searchField);
  
    try {
      const searchProducts = await Product.find({
        name: { $regex: searchField, $options: "i" },
      });

      // const searchProducts = await Product.find({
      //   $text: { $search: searchField }
      // });
  
      console.log(searchProducts);
      res.json(searchProducts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Problem searching for products.");
    }
  };


exports.searchForProducts = async (req, res) => {
  console.log("ProductsService.searchForProducts");

  const searchField = req.query.searchField;
  console.log("searchField", searchField);

  if (!searchField || !searchField.trim()) {
    return res.status(400).send("Missing or empty search term.");
  }

  const escapeRegex = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  console.log("EscapedRegex", escapeRegex(searchField));  

  try {
    const regex = new RegExp(escapeRegex(searchField), "i");
    const searchProducts = await Product.find({ name: regex });
    // const searchProducts = await Product.find({ name: /boot/i });


    console.log("searchProducts", searchProducts);
    res.status(200).json(searchProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Problem searching for products.");
  }
};




const updateCategories = async (req, res) => {
  console.log('category.service called...');

  try {
    const categories = await Category.find();

    for (const categoryDoc of categories) {
      let modified = false;


    console.log('categoryDoc', categoryDoc);

      // Add _id only if missing in subcategories
      const updatedSubcategories = categoryDoc.categories.map(sub => {
        if (!sub._id) {
          modified = true;
          return { ...sub.toObject?.() ?? sub, _id: new ObjectId() };
        }
        return sub;
      });

      if (modified) {
        categoryDoc.categories = updatedSubcategories;
        await categoryDoc.save(); // updates the document in DB
        console.log(`Updated category: ${categoryDoc._id}`);
      }
    }

    // res.status(200).json({ message: 'Categories updated successfully' });
  } catch (error) {
    console.error('Error in updateCategories:', error);
    // res.status(500).json({ error: 'Error updating categories' });
  }
};


