var express = require("express")
var router = express.Router()
const login_controller = require("../controllers/login_controller")


router.get('/', login_controller.login)
router.post("/", login_controller.authentication)

module.exports = router;
