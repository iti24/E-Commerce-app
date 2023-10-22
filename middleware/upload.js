const multer = require("multer");
const multerS3 = require("multer-s3");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const config = require("../config"); // Assuming you have a config file for credentials

// Initialize the S3 client
const s3 = new S3Client({
  region: config.region, // Update this with your AWS region
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

// Multer S3 Setup
const upload = multer({
  storage: multerS3({
    s3,
    bucket: config.bucketname, // Your S3 bucket name
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()); // Unique filename based on timestamp
    },
    // key: function (req, file, cb) {
    //   cb(null, file.originalname);
    // },
  }),
});

// Function to delete an object from S3
async function deleteObjectFromS3(key) {
  try {
    const deleteCommand = new DeleteObjectCommand({
      bucket: config.bucketname, // Your S3 bucket name
      Key: key,
    });
    await s3.send(deleteCommand);
  } catch (err) {
    console.error("Error deleting object from S3:", err);
  }
}

module.exports = {
  upload,
  deleteObjectFromS3,
};
