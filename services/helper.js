const db = require("../models");
const User = db.user;

  exports.check_duplicate_email = (req, res, next) => {
    if (!req.body.email) {
      res.status(400).send({
        message: "Email Required!"
      });
    }
    // Email
    User.findOne({
      where: {
        email: req.body.email,
        user_type:req.body.user_type
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email already in use!"
        });
        return;
      }
  
      next();
    });
  
  };