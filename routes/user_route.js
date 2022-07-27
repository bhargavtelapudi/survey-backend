const helper = require("../services/helper")
const controller = require("../controllers/auth_controller");
const admin_controller = require("../controllers/user_controller")
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
app.post("/api/create/survey", [protect.verifyToken], admin_controller.create_survey);
app.get("/api/survey/list", [protect.verifyToken], admin_controller.survey_list);
app.delete("/api/survey/:surveyId", [protect.verifyToken], admin_controller.delete_survey);
app.get("/api/survey/:surveyId", [protect.verifyToken], admin_controller.view_survey);
app.put("/api/survey/:surveyId", [protect.verifyToken], admin_controller.publish_survey);
app.post("/api/survey/sendemail", [protect.verifyToken], admin_controller.send_surveylink_email)

}