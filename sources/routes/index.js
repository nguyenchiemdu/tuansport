var apiRouter = require("./api");
var loginController = require("../controllers/login_controller");
var homeController = require("../controllers/home_controller");
var adminRouter = require("./admin");
var loginRouter = require("./login");
const authMiddlewares = require("../middlewares/auth.middlewares");

function route(app) {
  app.use("/admin", authMiddlewares.checkPermission ,adminRouter)
  app.use("/login",loginRouter)
  app.use("/api", apiRouter);
  app.use("/",homeController.home)
  
}

module.exports = route;