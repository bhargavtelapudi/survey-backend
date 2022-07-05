const helper = require("../services/helper")
const controller = require("../controllers/auth_controller");
const admin_controller = require("../controllers/admin_controller")
const protect = require("../protect")

app.get("/api/admin/userlist", [protect.verifyToken,protect.isSuperAdmin], admin_controller.users_list);
