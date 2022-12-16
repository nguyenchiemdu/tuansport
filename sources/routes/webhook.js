var express = require("express")
var router = express.Router()
const webhook_controller = require("../controllers/webhook_controller")


router.post('/update-product', webhook_controller.updateProduct)
router.post('/delete-product', webhook_controller.deleteProduct)
module.exports = router;
