var apiRouter = require("./api");
var homeController = require("../controllers/home_controller");
const auth_controller = require("../controllers/auth_controller")

var adminRouter = require("./admin");
var authRouter = require("./auth");
var productRouter = require("./product");
var homeRouter = require("./home");

const authMiddlewares = require("../middlewares/auth.middlewares");

function route(app) {
  app.use("/admin", authMiddlewares.checkPermission ,adminRouter)
  app.use("/login",authRouter)
  app.use("/api", apiRouter)
  app.use("/san-pham",productRouter)
  app.use("/api", apiRouter);
  app.get("/signout",auth_controller.signout)
  app.use("/",homeRouter)
  
}

module.exports = route;