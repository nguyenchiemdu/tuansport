const AppString = require("../common/app_string");
const { writeFile, baseRespond } = require("../common/functions");
const mongoProduct = require("../models/mongo/mongo.product");
const mongoCategory = require("../models/mongo/mongo.category");
const KiotvietAPI = require("../common/kiotviet_api");
const ApiUrl = require("../common/api_url");
const mongoProductAttribute = require("../models/mongo/mongo.product_attribute");

class WebhookController {
    async updateProduct(req, res, next) {
        try {
            let body = req.body;
            let newProduct;
            try {
                newProduct = body?.Notifications[0]?.Data[0];
            } catch (err) {
                newProduct == null;
            }
            if (newProduct != null) {
                let updateFields = {
                    skuCode: newProduct.Code,
                    name: newProduct.Name,
                    fullName: newProduct.FullName,
                    categoryId: newProduct.CategoryId
                }
                await mongoProduct.findOneAndUpdate({
                    _id: newProduct.Id
                }, updateFields)
                let category = await mongoCategory.findById(newProduct.CategoryId)
                if (category == null) {
                    let response = await KiotvietAPI.callApi(ApiUrl.getCategoryById(newProduct.CategoryId))
                    await mongoCategory.create({
                        _id: response.categoryId,
                        categoryName: response.categoryName,
                        parentId: 0
                    })
                }
                // await writeFile('./sources/public/update-product.json', JSON.stringify(body))
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
            let deletedId;
            try {
                deletedId = body?.RemoveId;
            } catch (err) {
                deletedId = null
            }
            if (deletedId != null) {
                await mongoProduct.deleteOne({
                    _id: deletedId
                })
                await mongoProductAttribute.deleteMany({
                    productId: deletedId
                })
                // await writeFile('./sources/public/delete-product.json', JSON.stringify(body))
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
}

module.exports = new WebhookController();