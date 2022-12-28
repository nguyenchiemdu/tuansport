const AppString = require("../common/app_string");
const { writeFile, baseRespond, mongoProductFromKiotVietProduct, lowercaseKey } = require("../common/functions");
const mongoProduct = require("../models/mongo/mongo.product");
const mongoCategory = require("../models/mongo/mongo.category");
const KiotvietAPI = require("../common/kiotviet_api");
const ApiUrl = require("../common/api_url");
const mongoProductAttribute = require("../models/mongo/mongo.product_attribute");
const { updateMasterProduct } = require("../common/model_function");

class WebhookController {
    async updateProduct(req, res, next) {
        try {
            let body = req.body;
            console.log(body);
            let newProduct;
            try {
                newProduct = body?.Notifications[0]?.Data[0];
            } catch (err) {
                newProduct == null;
            }
            if (newProduct != null) {
                newProduct = lowercaseKey(newProduct)
                let checkProduct = await mongoProduct.findOne({ _id: newProduct.Id })
                if (checkProduct != null) {
                    let updateFields = {
                        masterProductId : newProduct.MasterProductId,
                        skuCode: newProduct.Code,
                        name: newProduct.Name,
                        fullName: newProduct.FullName,
                        categoryId: newProduct.CategoryId,
                        onHand : mongoProductFromKiotVietProduct(newProduct).onHand
                    }
                    await mongoProduct.findOneAndUpdate({
                        _id: newProduct.Id
                    }, updateFields)
                } else {
                    newProduct = lowercaseKey(newProduct)
                    let mongoProduct = mongoProductFromKiotVietProduct(newProduct);
                    await mongoProduct.create(newProduct)
                }
                // update total onHand
                let mongoNewProd = mongoProductFromKiotVietProduct(newProduct)
                let masterId = newProduct.MasterProductId != null ? newProduct.MasterProductId :newProduct.Id;
                let oldTotal = checkProduct?.onHand?? 0
                let newTotal = mongoNewProd.onHand
                updateMasterProduct(masterId)
                // end of update total onHand

                let category = await mongoCategory.findById(newProduct.CategoryId)
                if (category == null) {
                    let response = await KiotvietAPI.callApi(ApiUrl.getCategoryById(newProduct.CategoryId))
                    await mongoCategory.create({
                        _id: response.categoryId,
                        categoryName: response.categoryName,
                        parentId: 0
                    })
                }
                await writeFile('./sources/public/update-product.json', JSON.stringify(body))
                res.json(baseRespond(true, AppString.ok))
            } else {
                throw 'Incorrect format'
            }
        } catch (err) {
            console.error(err);
            res.status(400)
            res.json(baseRespond(false, err))
        }
    }
    async deleteProduct(req, res, next) {
        try {
            let body = req.body;
            console.log(body)
            let deletedId;
            try {
                deletedId = body?.RemoveId;
            } catch (err) {
                deletedId = null
            }
            if (deletedId != null) {
                let checkProduct = await mongoProduct.findOne({ _id: deletedId })
                if (checkProduct != null) {
                    await mongoProduct.deleteOne({
                        _id: deletedId
                    })
                    await mongoProductAttribute.deleteMany({
                        productId: deletedId
                    })
                }

                await writeFile('./sources/public/delete-product.json', JSON.stringify(body))
                res.json(baseRespond(true, AppString.ok))

            } else {
                throw "Incorrect format"
            }
        } catch (err) {
            console.error(err);
            res.status(400)
            res.json(baseRespond(false, err))
        }
    }
    async updateOnHand(req, res, next) {
        try {
            let body = req.body;
            console.log(body);
            let newProduct;
            try {
                newProduct = body?.Notifications[0]?.Data[0];
            } catch (err) {
                newProduct == null;
            }
            if (newProduct != null) {
                let updateFields = {
                    onHand: newProduct.OnHand,
                }
                let checkProduct = await mongoProduct.findOne({ _id: newProduct.ProductId })
                if (checkProduct != null) {
                    await mongoProduct.findOneAndUpdate({
                        _id: newProduct.ProductId
                    }, updateFields)

                // update total onHand
                let masterId = checkProduct.masterProductId != null ? checkProduct.masterProductId :checkProduct._id;
                let oldTotal = checkProduct?.onHand?? 0
                let newTotal = newProduct.OnHand
                updateMasterProduct(masterId)
                // end of update total onHand
                }
                
                await writeFile('./sources/public/update-onhand.json', JSON.stringify(body))
                res.json(baseRespond(true, AppString.ok))
            } else {
                throw 'Incorrect format'
            }
        } catch (err) {
            console.error(err);
            res.status(400)
            res.json(baseRespond(false, err))
        }
    }
    static async updateTotalOnHand(masterId,oldTotal,newTotal) {
        if (oldTotal < 0) oldTotal = 0
        if (newTotal < 0) newTotal = 0
        let changeAmmount = newTotal - oldTotal;
        if (changeAmmount == 0) return;
        let masterProduct = await mongoProduct.findOne({ _id: masterId })
        if (masterProduct != null) {
            let totalOnHand = masterProduct.totalOnHand ?? 0;
            totalOnHand += changeAmmount;
            if (totalOnHand >= 0) {
                await mongoProduct.updateOne({ _id: masterId }, {
                     $set: { totalOnHand: totalOnHand}
                })
            }

        }
        


        
    }
}

module.exports = new WebhookController();