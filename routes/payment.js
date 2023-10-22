const express = require("express");
const router = express.Router();
const { online, cod } = require("../controllers/payment");
router.post("/online", online);
router.get("/cod", cod);

module.exports = router;
