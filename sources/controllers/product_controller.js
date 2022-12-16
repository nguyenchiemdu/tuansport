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
            productAttributes = await Promise.all(dataProductAttributes.map(async attribute => {
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
            console.log(productAttributes)
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
            let role = req.headers.userInfor?.role;
            let categoryId = req.params.category
            let sizes = JSON.parse(req.query.sizes ?? '[]')
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
                } else {
                    listCategoryid.push(node._id)
                }
            }
            let findCondition = {
                categoryId: {
                    $in: listCategoryid
                },
                masterProductId: null,
                isSynced: true,

            };
            if (sizes != null && sizes.length > 0) {
                findCondition = {
                    categoryId: {
                        $in: listCategoryid
                    },
                    isSynced: true,
                    size: {
                        $in: sizes
                    }
                }
            }
            let priceParam = 'price';
            if (role == 'Cộng tác viên') {
                priceParam = 'ctvPrice'
            }
            let priceCondition = {}
            // query min value 
            if (min != null) {
                priceCondition['$gte'] = min
            }
            if (max != null) {
                priceCondition['$lte'] = max

            }
            if (Object.keys(priceCondition).length > 0) {
                findCondition[priceParam] = priceCondition
            }
            let query = getQueryString(req)
            let page = req.query.page ?? 1;
            let response = await getTableDataWithPagination(req, mongoProduct, {
                findCondition: findCondition
            })
            res.render('product/product_by_category', { user: req.headers.userInfor, ...response, page, query, category: parent })
        } catch (err) {
            console.log(err);
            res.status(400)
            next(err);
        }
    }
    // GET /products
    async searchProductResult(req, res, next) {
        try {
            let searchText = req.query.search;
            let newest = req.query.newest ?? false;
            let listFindCondition = [
            ]
            if (searchText != null && searchText.length > 0) {
                listFindCondition = [
                    { "name": { $regex: searchText, $options: 'i' }, masterProductId: null },
                    { "fullName": { $regex: searchText, $options: 'i' }, masterProductId: null },
                    { "skuCode": { $regex: searchText } }
                ]
            }
            let findCondition = {
                isSynced: true
            }
            if (listFindCondition.length > 0) {
                findCondition['$or'] = listFindCondition
            } else {
                findCondition['masterProductId'] = null
            }
            let query = getQueryString(req)
            let page = req.query.page ?? 1;
            let sortCondition = newest? '-updatedAt': ''
            let response = await getTableDataWithPagination(req, mongoProduct, {
                sortCondition:sortCondition,
                findCondition: findCondition
            })
            res.render('product/product_search', { user: req.headers.userInfor, ...response, page, query, searchText,newest })
        } catch (err) {
            console.log(err);
            res.status(400)
            next(err);
        }
    }
}

module.exports = new ProductController();