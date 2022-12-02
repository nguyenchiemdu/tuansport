const { json } = require("express");
const AppString = require("../common/app_string");
const { isValidateEmail, baseRespond, generateJWT } = require("../common/functions");
const { getTableDataWithPagination } = require("../common/pagination");
const mongoProduct = require("../models/mongo/mongo.product")
const mongoProductAttribute = require("../models/mongo/mongo.product_attribute");
const mongoAttribute = require("../models/mongo/mongo.attribute");

class ProductController {
    // GET 
    async productDetail(req, res) {
        // res.json(req.headers.userInfor)
        let skuCode = req.params.code
        let product = await mongoProduct.findOne({
            skuCode: skuCode
        })
        let mapAttributes = {

        }
        let listIdGroupProduct = await mongoProduct.find({
            masterProductId: product._id
        }).then(products => products.map((product) => { return { productId: product._id } }));
        listIdGroupProduct.push({ productId: product._id })
        let productAttributes = await mongoProductAttribute.find({
            $or: listIdGroupProduct
        }).populate('attributeValueId').exec().
            then(async (attributes) => {
                for (let i = 0; i < attributes.length; i++) {
                    let attribute = await mongoAttribute.find({
                        _id: attributes[i].attributeValueId.attributeId
                    })
                    if (mapAttributes[attribute[0].name] == null) {
                        mapAttributes[attribute[0].name] = []
                    }
                    if (!mapAttributes[attribute[0].name].includes(attributes[i].attributeValueId))
                        mapAttributes[attribute[0].name].push(attributes[i].attributeValueId)
                    attributes[i].attribute = attribute[0]
                }
                return attributes
            })
        let mappedProductAttributes = {

        }
        for (let proAttr of productAttributes) {
            let attribute = {
                attributeId: proAttr.attributeValueId.attributeId,
                value: proAttr.attributeValueId.value
            }
            if (mappedProductAttributes[proAttr.productId] == null) mappedProductAttributes[proAttr.productId] = []
            mappedProductAttributes[proAttr.productId].push(attribute)
        }
        let { docs } = await getTableDataWithPagination(req, mongoProduct, {
            findCondition: {
                masterProductId: null,
                isSynced : true
            }
        })
        // res.json(baseRespond(true,AppString.ok,product))
        res.render("product/product_detail", {
            product, data: docs, mapAttributes, mappedProductAttributes
        })
    }
}

module.exports = new ProductController();