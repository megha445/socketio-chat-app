const jwt = require('jsonwebtoken');
const {User} = require('../models/user.model.js');

exports.protectRoute = async (req, res, next) => {
//   console.log("protectRoute hit: cookie jwt =", req.cookies.jwt);

  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token");
    return res.status(401).json({ error: "Unauthorized, no token" });
  }

  try {
    // console.log("Cookie header raw:", req.headers.cookie);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Unauthorized, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Token invalid:", err.message);
    return res.status(401).json({ error: "Unauthorized, token invalid" });
  }
};

