var express = require("express");
const home_controller = require("../controllers/home_controller");
var router = express.Router()


router.get("/wishlist", home_controller.wishlist)
router.get("/", home_controller.home)

module.exports = router;