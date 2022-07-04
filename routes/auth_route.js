const helper = require("../services/helper")
const controller = require("../controllers/auth_controller");
const protect = require("../protect")
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/register",
  helper.check_duplicate_email,
    controller.sign_up
  );

   app.post("/api/auth/login", controller.user_signin);


};
