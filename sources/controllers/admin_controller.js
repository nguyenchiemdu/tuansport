const { response } = require("express");
const { mongo } = require("mongoose");
const { default: axios } = require("axios");
const AppString = require("../common/app_string");
const { baseRespond, getQueryString, toPathString } = require("../common/functions");
const { getTableDataWithPagination } = require("../common/pagination");
const KiotVietProduct = require("../models/kiotviet/kiotviet.product");
const { find } = require("../models/mongo/mongo.product");
const mongoProduct = require("../models/mongo/mongo.product");
const mongoUser = require("../models/mongo/mongo.user")
const mongoAttribute = require("../models/mongo/mongo.attribute")
const mongoAttributeValue = require("../models/mongo/mongo.attribute_value")
const mongoProductAttribute = require("../models/mongo/mongo.product_attribute")
const mongoCategory = require("../models/mongo/mongo.category")
const KiotvietAPI = require('../common/kiotviet_api');
const ApiUrl = require("../common/api_url");
const KiotVietCategory = require("../models/kiotviet/kiotvet.category");
class AdminController {
    // GET  /products
    async products(req, res) {
        let route = req.route.path;
        let query = getQueryString(req)
        let page = req.query.page ?? 1
        let pageSize = req.query.pageSize ?? 20
        let name = req.query.name;
        let response = await KiotVietProduct.getProducts({ currentItem: (page - 1) * pageSize, pageSize: pageSize, includePricebook: true, name: name })
        response.data = await Promise.all(response.data.map(async product => {
            let syncProduct = await mongoProduct.find({
                skuCode: product.code,
                isSynced: true
            })
            if (syncProduct.length > 0) {
                product.isSynced = true
            }
            return product
        }));
        res.render("admin/admin_products", { ...response, page: page, route: route, query: query, name: name })
    }
    // GET /admin/ctv
    async ctv(req, res) {
        let route = req.route.path;
        let pageSize = req.query.pageSize ?? 20
        let username = req.query.username ?? ''
        let query = getQueryString(req)
        // let page = req.query.page ?? 1
        // let pageSize = req.query.pageSize ?? 20
        let { docs, currentPage, pages, countResult } = await getTableDataWithPagination(req, mongoUser, { findCondition: { "username": { $regex: username }, 'role': 'Cộng tác viên' } })
        res.render("admin/admin_ctv", { route: route, page: currentPage, total: pages * pageSize, data: docs, pageSize: pageSize, query: query, username: username })
    }
    // GET /admin/ctv/:id
    async editCtv(req, res, next) {
        let route = req.route.path;
        let id = req.params.id
        let ctv = await mongoUser.findById(id)
        if (ctv != null) {
            res.render("admin/admin_edit_ctv", { itemData: ctv, route: route, notification: '' })
        } else {
            res.status(400)
            next(AppString.dataNotFound)
        }
    }
    // PUT /admin/ctv/:id
    async updateCtv(req, res, next) {
        let route = req.route.path;
        let id = req.params.id
        let ctv = await mongoUser.findOneAndUpdate({
            _id: id
        }, req.body)
        ctv = await mongoUser.findById(id)
        if (ctv != null) {
            res.render("admin/admin_edit_ctv", { itemData: ctv, route: route, notification: AppString.updateUserInforSuccess })
        } else {
            res.status(400)
            next(AppString.dataNotFound)
        }
    }
    // DELETE /admin/ctv/:id
    async deleteCtv(req, res, next) {
        try {
            let id = req.params.id
            await mongoUser.deleteOne({
                _id: id
            })
            res.json(baseRespond(true, AppString.deleteSuccess))
        } catch (err) {
            console.log(err)
            res.status(400)
            next(AppString.dataNotFound)
        }

    }

    // GET /admin/ctv/create
    async createCtv(req, res, next) {
        let route = req.route.path;
        res.render("admin/admin_create_ctv", { route: route, notification: '' })

    }
    // POST /admin/ctv/create
    async postCreateCtv(req, res, next) {
        try {
            let route = req.route.path;
            let ctv = await mongoUser.create(req.body)
            res.render("admin/admin_create_ctv", { route: route, notification: AppString.createCtvSuccess })
        } catch (err) {
            console.log(err)
            res.status(400)
            next(AppString.error)
        }

    }
    // POST /sync-product
    async syncProductPost(req, res) {
        try {
            let product = req.body;
            // upsert creates a document if not finds a document
            let options = { upsert: true, new: true, setDefaultsOnInsert: true }
            let resProduct = await mongoProduct.find({
                skuCode: product.skuCode
            })
            let response
            if (resProduct.length > 0) {

                response = await mongoProduct.updateOne({
                    skuCode: product.skuCode
                }, {
                    $set: { isSynced: !resProduct[0].isSynced }
                })
                // add size in to category parents
                let res = await KiotvietAPI.callApi(ApiUrl.getProductById(product.id))
                product = res.data
                product = {
                    _id: product.id,
                    skuCode: product.code,
                    name: product.name,
                    fullName: product.fullName,
                    price: product.basePrice,
                    ctvPrice: product.priceBooks?.find(e => e.priceBookName == 'GIÁ CTV').price,
                    salePrice: product.priceBooks?.find(e => e.priceBookName == 'giá khuyến mãi').price,
                    images: product.images,
                    categoryId: product.categoryId,
                    isSynced: product.isSynced,
                    masterProductId: product.masterProductId ?? null,
                    attributes: product.attributes
                }
                let size = product.attributes?.find(item => item.attributeName == 'SIZE')?.attributeValue
                let parentId = product.categoryId;
                while (parentId != null) {
                    let category = await mongoCategory.findById(parentId)
                    if (category == null) {
                        category = await KiotVietCategory.getCategoryById(parentId)
                        if (category != null) {
                            await mongoCategory.create({
                                _id: category.categoryId,
                                categoryName: category.categoryName,
                                parentId: 0
                            })
                            category = {
                                _id: response.categoryId,
                                categoryName: response.categoryName,
                                parentId: 0
                            }
                        }
                    }
                    if (category != null && size != null) {
                        let listSize = category.listSize ?? [];
                        listSize = listSize.filter(e => e != size)
                        if (!resProduct[0].isSynced) listSize.push(size)
                        await mongoCategory.updateOne({
                            _id: parentId
                        }, {
                            $set: { listSize: listSize }
                        })
                    }
                    parentId = category?.parentId
                }
            }
            else {
                response = await KiotvietAPI.callApi(ApiUrl.getProductById(product.id))
                product = response.data
                product = {
                    _id: product.id,
                    skuCode: product.code,
                    name: product.name,
                    fullName: product.fullName,
                    price: product.basePrice,
                    ctvPrice: product.priceBooks?.find(e => e.priceBookName == 'GIÁ CTV').price,
                    salePrice: product.priceBooks?.find(e => e.priceBookName == 'giá khuyến mãi')?.price,
                    images: product.images,
                    categoryId: product.categoryId,
                    isSynced: product.isSynced,
                    masterProductId: product.masterProductId ?? null,
                    attributes: product.attributes
                }
                response
                    = await mongoProduct.findOneAndUpdate(
                        {
                            skuCode: product.skuCode
                        }, product, options
                    );
                if (product.attributes != null)
                    for (let attribute of product.attributes) {
                        let resAttribute = await mongoAttribute.findOne({
                            name: attribute.attributeName
                        })
                        let resValue = await mongoAttributeValue.findOne({
                            attributeId: resAttribute._id,
                            value: attribute.attributeValue
                        })
                        if (resValue == null) {
                            resValue = await mongoAttributeValue.create({
                                attributeId: resAttribute._id,
                                value: attribute.attributeValue
                            })
                        }
                        await mongoProductAttribute.create({
                            productId: product._id,
                            attributeValueId: resValue._id
                        })
                    }
                // add size in to category parents
                let size = product.attributes?.find(item => item.attributeName == 'SIZE')?.attributeValue
                let parentId = product.categoryId;
                while (parentId != null) {
                    let category = await mongoCategory.findById(parentId)
                    if (category == null) {
                        category = await KiotVietCategory.getCategoryById(parentId)
                        if (category != null) {
                            await mongoCategory.create({
                                _id: category.categoryId,
                                categoryName: category.categoryName,
                                parentId: 0
                            })
                            category = {
                                _id: response.categoryId,
                                categoryName: response.categoryName,
                                parentId: 0
                            }
                        }
                    }
                    if (category != null && size != null) {
                        let listSize = category.listSize ?? [];
                        listSize = listSize.filter(e => e != size)
                        listSize.push(size)
                        await mongoCategory.updateOne({
                            _id: parentId
                        }, {
                            $set: { listSize: listSize }
                        })
                    }
                    parentId = category?.parentId
                }
            }
            res.json(baseRespond(true, AppString.ok, response))
        } catch (e) {
            console.log(e)
            res.status(400)
            res.json(baseRespond(false, AppString.error, e))
        }
    }
}

module.exports = new AdminController();