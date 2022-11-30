var apiRouter = require("./api");
var homeController = require("../controllers/home_controller");
var adminRouter = require("./admin");
var loginRouter = require("./login");
var productRouter = require("./product");
var homeRouter = require("./home");

const authMiddlewares = require("../middlewares/auth.middlewares");

function route(app) {
  app.use("/admin", authMiddlewares.checkPermission ,adminRouter)
  app.use("/login",loginRouter)
  app.use("/api", apiRouter)
  app.use("/san-pham",productRouter)
  app.use("/api", apiRouter);
  app.use("/",homeRouter)
  
}

module.exports = route;