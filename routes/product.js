const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  searchproducts,
} = require("../controllers/product");
const { upload } = require("../middleware/upload");
const { checkSeller } = require("../middleware/auth");

router.post("/", checkSeller, upload.single("image"), addProduct);
router.get("/", getProduct);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.put("/:id", checkSeller, upload.single("image"), updateProduct);
router.get("/search", searchproducts);

module.exports = router;
