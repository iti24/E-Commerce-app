const Product = require("../models/product");
const { deleteObjectFromS3 } = require("../middleware/upload");
const addProduct = async (req, res) => {
  console.log("body", req.body);
  const productData = req.body;
  // const file = req.file;

  try {
    const product = new Product({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      // imageUrl:  `https://testupimg.s3.ap-south-1.amazonaws.com/${req.file.originalname}`,
      imageUrl: req.file.location,
      // Other product data fields
    });

    // console.log("file",req.file.location)
    // const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "the product  save successfully " });
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number (default to 1)
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;
    const products = await Product.find().skip(skip).limit(perPage);

    res.status(201).json(products);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};
const getProductById = async (req, res) => {
  try {
    // const employee = await Employee.find();

    const product = await Product.findById(req.params.id);
    if (product == null) {
      res.status(404).json({ message: "product details are not found" });
    }
    res.status(201).json(product);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct.deletedCount === 0) {
      res.status(404).json({ message: "Product details not found" });
    }
    res.status(201).json(deletedProduct);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body);
//     if (product == null) {
//       res.status(404).json({ message: "product update failed" });
//     }

//     res.status(201).json(product);
//   } catch (error) {
//     res.status(501).json({ error: error.message });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    // Fetch the existing product to get the existing image URL
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the existing image from S3 if it exists
    if (existingProduct.imageUrl) {
      const key = existingProduct.imageUrl.split("/").pop();

      deleteObjectFromS3(key);
    }

    // Update the product with the new image
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        imageUrl: req.file.location, // Updated S3 URL of the image
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
};

const searchproducts = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const findProduct = await Product.find({
      $or: [
        { type: { $regex: searchTerm, $options: "i" } },
        { color: { $regex: searchTerm, $options: "i" } },
        { size: { $regex: searchTerm, $options: "i" } },
        { material: { $regex: searchTerm, $options: "i" } },
        { print: { $regex: Number(searchTerm) } },
      ],
    });
    if (!findProduct) {
      return res
        .status(404)
        .json({ message: "product details are not found not found" });
    }
    res.json(findProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addProduct,
  getProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  searchproducts,
};
