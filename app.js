const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const config = require("./config");
const authRoutes = require("./routes/auth");
const ProductRouter = require("./routes/product");
const CartRouter = require("./routes/cart");
const OrderRouter = require("./routes/order");
const PaymentRouter = require("./routes/payment");
const ReviewRouter = require("./routes/review");
const { requireAuth } = require("./middleware/auth");
const { upload } = require("./middleware/upload");

const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // Import AWS SDK v3 modules
const path = require("path");

mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB connection error"));

app.use(cors());
app.use(bodyParser.json());

console.log(config.accessKeyId);

// Initialize the S3 client
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

app.get("/", async (req, res) => {
  res.send("the server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/product", requireAuth, ProductRouter);
app.use("/api/cart", requireAuth, CartRouter);
app.use("/api/order", requireAuth, OrderRouter);
app.use("/api/payment", requireAuth, PaymentRouter);
app.use("/api/reviews", requireAuth, ReviewRouter);

app.listen(config.port, () => {
  console.log(`server started on port ${config.port}`);
});
