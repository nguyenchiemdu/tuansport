var express = require("express");
const home_controller = require("../controllers/home_controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
var router = express.Router()

router.get('/chinh-sach/:slug', home_controller.policy)
router.get('/checkout',authMiddlewares.checkPermissionCTV,home_controller.checkout)
router.get('/cart',authMiddlewares.checkPermissionCTV, home_controller.cart)
router.get("/wishlist",authMiddlewares.checkPermissionCTV, home_controller.wishlist)
router.get("/", home_controller.home)

module.exports = router;