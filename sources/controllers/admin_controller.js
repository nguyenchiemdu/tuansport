const { response } = require("express");
const { mongo } = require("mongoose");
const AppString = require("../common/app_string");
const { baseRespond } = require("../common/functions");
const { getTableDataWithPagination } = require("../common/pagination");
const KiotVietProduct = require("../models/kiotviet/kiotviet.product");
const { find } = require("../models/mongo/mongo.product");
const mongoProduct = require("../models/mongo/mongo.product");
const mongoUser = require("../models/mongo/mongo.user")
class AdminController {
    // GET  /products
    async products(req, res) {
        let route = req.route.path;
        let query = AdminController.getQueryString(req)
        let page = req.query.page ?? 1
        let pageSize = req.query.pageSize ?? 20
        let name = req.query.name;
        let response = await KiotVietProduct.getProducts({ currentItem: (page - 1) * pageSize, pageSize: pageSize, includePricebook: true, name: name })
        response.data = await Promise.all(response.data.map(async product => {
            let syncProduct = await mongoProduct.find({
                skuCode: product.code
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
        let query = AdminController.getQueryString(req)
        // let page = req.query.page ?? 1
        // let pageSize = req.query.pageSize ?? 20
        let { docs, currentPage, pages, countResult } = await getTableDataWithPagination(req,mongoUser, {findCondition: {"username" : {$regex : username},'role':'Cộng tác viên' }})
        res.render("admin/admin_ctv", { route: route, page: currentPage,total: pages*pageSize,data: docs,pageSize:pageSize, query: query,username: username })
    }
    // GET /admin/ctv/:id
    async editCtv(req, res,next) {
        let route = req.route.path;
        let id = req.params.id
        let ctv = await mongoUser.findById(id)
        if (ctv!=null) {
            res.render("admin/admin_edit_ctv",{itemData : ctv,route: route, notification: ''})
        } else {
            res.status(400)
            next(AppString.dataNotFound)
        }
    }
    // PUT /admin/ctv/:id
    async updateCtv(req, res,next) {
        let route = req.route.path;
        let id = req.params.id
        let ctv = await  mongoUser.findOneAndUpdate({
            _id : id
        }, req.body)
        ctv = await mongoUser.findById(id)
        if (ctv!=null) {
            res.render("admin/admin_edit_ctv",{itemData : ctv,route: route,notification: AppString.updateUserInforSuccess})
        } else {
            res.status(400)
            next(AppString.dataNotFound)
        }
    }
    // DELETE /admin/ctv/:id
    async deleteCtv(req, res,next) {
       try {
        let id = req.params.id
        await mongoUser.deleteOne({
            _id : id
        })
        res.json(baseRespond(true,AppString.deleteSuccess))
       } catch (err) {
        console.log(err)
        res.status(400)
        next(AppString.dataNotFound)
       }
        
    }
    
    // GET /admin/ctv/create
    async createCtv(req, res,next) {
        let route = req.route.path;
        res.render("admin/admin_create_ctv",{route: route, notification: ''})
        
    }
    // POST /admin/ctv/create
    async postCreateCtv(req, res,next) {
        try {
            let route = req.route.path;
        let ctv = await  mongoUser.create(req.body)
        res.render("admin/admin_create_ctv",{route: route, notification: AppString.createCtvSuccess})
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
            let response
            if (product.isSynced) {
                response = await mongoProduct.deleteOne({
                    skuCode: product.skuCode
                })
            } else {
                response
                    = await mongoProduct.findOneAndUpdate(
                        {
                            skuCode: product.skuCode
                        }, product, options
                    )
            }
            res.json(baseRespond(true, AppString.ok, response))
        } catch (e) {
            res.status(400)
            res.json(baseRespond(false, AppString.error, e))
        }
    }
    static getQueryString(req) {
        let query = req._parsedOriginalUrl.query ?? ''
        if (query.length > 0) {
            let ls = query.split('&')
            ls = ls.filter((item) => !item.includes('page'))
            query = ls.join('&')
        }
        return query
    }
}

module.exports = new AdminController();