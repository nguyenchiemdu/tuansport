var express = require("express")
var router = express.Router()
const apiController = require("../controllers/api_controller")


router.get("/", apiController.tryApi)

module.exports = router;
