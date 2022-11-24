var express = require("express");
var router = express.Router();
const adminController = require("../controllers/admin_controller");
const RedirectMiddleWare = require("../middlewares/redirect.middleware");

router.get("/",RedirectMiddleWare.redirect('/admin/products'));
router.get("/products", adminController.products);
router.get("/ctv", adminController.ctv);
router.post("/sync-product", adminController.syncProductPost);

module.exports = router;
