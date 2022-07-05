const db = require("../models");
const config = require("../config/auth_config");
const User = db.user;

exports.users_list = (req, res) => {
    //find all users
    User.findAll({
      where: {
        user_type: "user"
      }
    }).then(userlist => {
      return res.status(200).send(userlist);
    })
  };
  