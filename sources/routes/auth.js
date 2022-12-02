var express = require("express")
var router = express.Router()
const auth_controller = require("../controllers/auth_controller")


router.get('/', auth_controller.login)
router.post("/", auth_controller.authentication)

module.exports = router;
