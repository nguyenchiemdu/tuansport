var express = require("express");
var router = express.Router();

const adminController = require("../controllers/admin_controller");

router.get("/", adminController.dashboard);
module.exports = router;
