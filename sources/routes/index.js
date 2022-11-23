var apiRouter = require("./api");
var loginController = require("../controllers/login_controller");
var adminRouter = require("./admin");


function route(app) {
  app.use("/admin",adminRouter)
  app.use("/login",loginController.login)
  app.use("/api", apiRouter);
  
}

module.exports = route;