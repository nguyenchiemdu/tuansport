var express = require("express");
var router = express.Router();
const adminController = require("../controllers/admin_controller");
const RedirectMiddleWare = require("../middlewares/redirect.middleware");

router.get("/",RedirectMiddleWare.redirect('/admin/products'));
router.get("/products", adminController.products);
router.get("/password", adminController.password);
router.put("/password", adminController.putPassword);
router.get("/synced-products/:id", adminController.editSyncedProduct);
router.put("/synced-products/:id", adminController.updateProduct);
router.get("/synced-products", adminController.syncedProducts);
router.get("/ctv/create", adminController.createCtv);
router.post("/ctv/create", adminController.postCreateCtv);
router.get("/ctv/:id", adminController.editCtv);
router.put("/ctv/:id", adminController.updateCtv);
router.delete("/ctv/:id", adminController.deleteCtv);
router.get("/ctv", adminController.ctv);
router.post("/sync-product", adminController.syncProductPost);

module.exports = router;
