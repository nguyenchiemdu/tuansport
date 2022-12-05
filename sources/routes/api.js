var express = require("express")
var router = express.Router()
const apiController = require("../controllers/api_controller")

router.get("/product/:id", apiController.getProductByID)
router.get("/product/code/:skucode", apiController.getProductBySkuCode)
router.post("/order",apiController.createOrder)
router.get("/", apiController.tryApi)

module.exports = router;
