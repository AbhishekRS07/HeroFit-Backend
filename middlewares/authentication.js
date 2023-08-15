const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Please log in first" });
  } else {
    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: "Please log in" });
      } else {
        const user_id = decoded.user_id;
        req.user_id = user_id;
        next();
      }
    });
  }
};

module.exports = {
  authentication,
};
