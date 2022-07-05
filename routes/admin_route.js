const helper = require("../services/helper")
const controller = require("../controllers/auth_controller");
const admin_controller = require("../controllers/admin_controller")
const protect = require("../protect")
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
app.get("/api/admin/userlist", [protect.verifyToken,protect.isSuperAdmin], admin_controller.users_list);
}