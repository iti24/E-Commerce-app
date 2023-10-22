const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config");

const requireAuth = async (req, res, next) => {
  try {
    console.log("header", req.headers);
    const token = req.headers.authorization;
    console.log("token", token);

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the token
    const decodedToken = await jwt.verify(token, config.jwtSecret);
    console.log("decoded", decodedToken);

    // Find the user by ID from the decoded token
    const user = await User.findById(decodedToken.userId);
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach the user to the request object
    req.user = user;
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
const checkSeller = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    // User is a seller, allow them to proceed
    next();
  } else {
    // User is not a seller, return an error response
    return res
      .status(403)
      .json({ error: "Only sellers are allowed to perform this action." });
  }
};
module.exports = { requireAuth, checkSeller };
