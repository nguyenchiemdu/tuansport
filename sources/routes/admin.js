var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({dest:'./sources/public/uploads'})
const adminController = require("../controllers/admin_controller");
const RedirectMiddleWare = require("../middlewares/redirect.middleware");

router.get("/",RedirectMiddleWare.redirect('/admin/products'));
router.get("/products", adminController.products);
router.get("/password", adminController.password);
router.put("/password", adminController.putPassword);
router.post('/synced-products/:id/create-tag',adminController.addTag);
router.post('/synced-products/:id/delete-tag',adminController.deleteTag);
router.post('/synced-products/:id/upload-img',upload.single('product'),adminController.uploadImage);
router.post('/synced-products/:id/delete-img',adminController.deleteImage);
router.get("/synced-products/:id", adminController.editSyncedProduct);
router.put("/synced-products/:id", adminController.updateProduct);
router.get("/synced-products", adminController.syncedProducts);
router.get("/ctv/create", adminController.createCtv);
router.post("/ctv/create", adminController.postCreateCtv);
router.get("/ctv/:id", adminController.editCtv);
router.put("/ctv/:id", adminController.updateCtv);
router.delete("/ctv/:id", adminController.deleteCtv);
router.get("/ctv", adminController.ctv);
router.get("/category", adminController.category);
// router.post("/category/add-new-category", adminController.addNewCategory);
router.patch("/category/:id/position", adminController.updateCategoryPosition);
router.post("/category/:id/create-folder", adminController.createFolder);
router.post("/category/:id/delete-folder", adminController.deleteFolder);
router.post("/sync-product", adminController.syncProductPost);
router.post("/sync-marked", adminController.markedProduct)

module.exports = router;
