var express = require("express")
var router = express.Router()
const product_controller = require("../controllers/product_controller")


router.get('/:code', product_controller.productDetail)
module.exports = router;
