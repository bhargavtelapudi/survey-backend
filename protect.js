const jwt = require("jsonwebtoken");
const config = require("./config/auth_config");
const db = require("./models");
const User = db.user;

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "token is required to access this API!"
    });
  }

  await jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isSuperAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user == null) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    if (user.user_type === "admin") {
      next();
      return;
    }


    res.status(403).send({
      message: " you are trying to access restricted API!"
    });
    return;

  });
};


module.exports = {verifyToken,isSuperAdmin}