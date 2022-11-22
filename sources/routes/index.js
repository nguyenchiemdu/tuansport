var apiRouter = require("./api");
var loginController = require("../controllers/login_controller");

function route(app) {
  app.use("/login",loginController.login )
  app.use("/api", apiRouter);
  
}

module.exports = route;