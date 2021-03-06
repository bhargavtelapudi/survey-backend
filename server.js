const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.options('*', cors());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// set up database 
 const db = require("./models");
// for not to recreate each time database but add new things
 db.sequelize.sync();
// for devel to recreate each time database 
//db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
//});
// simple route
app.get("/api/test-deploy", (req, res) => {
  return res.send("api is working")
})
require('./routes/auth_route')(app);
require('./routes/user_route')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
