const { json } = require("express");
const AppString = require("../common/app_string");
const { isValidateEmail, baseRespond, generateJWT, getQueryString } = require("../common/functions");
const { getTableDataWithPagination } = require("../common/pagination");
const mongoProduct = require("../models/mongo/mongo.product")
const mongoProductAttribute = require("../models/mongo/mongo.product_attribute");
const mongoAttribute = require("../models/mongo/mongo.attribute");
const mongoCategory = require("../models/mongo/mongo.category");

class ProductController {
    // GET 
    async productDetail(req, res, next) {
        // res.json(req.headers.userInfor)
        try {
            let skuCode = req.params.code
            let product = await mongoProduct.findOne({
                skuCode: skuCode,
                isSynced: true
            })
            let mapAttributes = {

            }
            let listIdGroupProduct = await mongoProduct.find({
                masterProductId: product._id
            }).then(products => products.map((product) => { return { productId: product._id } }));
            listIdGroupProduct.push({ productId: product._id })
            let productAttributes;
            
            let dataProductAttributes = await mongoProductAttribute.find({
                $or: listIdGroupProduct
            }).populate('attributeValueId').exec()
            productAttributes = await Promise.all(dataProductAttributes.map(async attribute=> {
                let attr = await mongoAttribute.find({
                    _id: attribute.attributeValueId.attributeId
                })
                if (mapAttributes[attr[0].name] == null) {
                    mapAttributes[attr[0].name] = []
                }
                if (!mapAttributes[attr[0].name].includes(attribute.attributeValueId))
                    mapAttributes[attr[0].name].push(attribute.attributeValueId)
                attribute.attribute = attr[0]
                return attribute;
            }))
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
                    isSynced: true
                }
            })
            // res.json(baseRespond(true,AppString.ok,product))
            res.render("product/product_detail", {
                product, data: docs, mapAttributes, mappedProductAttributes, user: req.headers.userInfor
            })
        } catch (err) {
            console.log(err);
            res.status(400)
            next(err);
        }

    }
    async productByCategory(req, res, next) {
        try {
        let categoryId = req.params.category
            let sizes = JSON.parse(req.query.sizes?? '[]')
            let min = req.query.min
            let max = req.query.max
            // get all children of category
            let listCategoryid = []
            let parent = await mongoCategory.findOne({ _id: categoryId })
            let stack = [parent]
            while (stack.length > 0) {
                let node = stack.pop()
                let categories = await mongoCategory.find({ parentId: node._id })
                if (categories.length > 0) {
                    stack.push(...categories)
                }else  {
                    listCategoryid.push(node._id)
                }
            }
            let listFindCondition = listCategoryid.map(id=> {return {categoryId: id}})
            let query = getQueryString(req)
            let page = req.query.page ?? 1;
            let response = await getTableDataWithPagination(req, mongoProduct, {
                findCondition: {
                   $or:listFindCondition,masterProductId: null,
                   isSynced: true
                }
            })
            res.render('product/product_by_category', { user: req.headers.userInfor, ...response, page, query,category:parent })
        } catch (err) {
            console.log(err);
            res.status(400)
            next(err);
        }
    }
}

module.exports = new ProductController();