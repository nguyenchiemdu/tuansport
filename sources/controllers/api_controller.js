const { json, response } = require("express");
const ApiUrl = require("../common/api_url");
const AppString = require("../common/app_string");
const { baseRespond } = require("../common/functions");
const KiotvietAPI = require("../common/kiotviet_api");
const KiotVietOrder = require("../models/kiotviet/kiotviet.order");
const mongoProduct = require("../models/mongo/mongo.product");

class ApiController {
    tryApi(_, res) {
        let response = { "success": true, "message": "OK", "data": "" };
        res.json(response);
        console.log(response)
    }
    // GET
    async getProductByID(req, res, next) {
        try {
            let url = ApiUrl.getProductById(req.params.id)
            let response = await KiotvietAPI.callApi(url)
            res.json(baseRespond(true, AppString.ok, response.data))
        } catch (err) {
            console.error(err)
            res.status(400)
            next(err)
        }
    }
    // GET
    static async getProductBySkuCodeInMongo(skuCode) {
        try{
            let product = await mongoProduct.find({
                skuCode: skuCode
            }).exec()
            return product
        } catch(err) {
            console.error(err)
        }
    }
    // GET
    async getProductBySkuCode(req, res, next) {
        try {
            let url = ApiUrl.getProductBySkuCode(req.params.skucode)
            let productInMongo = await ApiController.getProductBySkuCodeInMongo(req.params.skucode)
            let temp 
            productInMongo.forEach(product => temp = {...product}._doc)
            let response = await KiotvietAPI.callApi(url)
            let kiotvietProduct = response.data;
            let product = await mongoProduct.findOne({
                skuCode: req.params.skucode
            });
            if (product == null) throw res.json(baseRespond(false, AppString.dataNotFound))
            let combinedProduct =  Object.assign({}, kiotvietProduct, product._doc);
            res.json(baseRespond(true, AppString.ok, combinedProduct))
        } catch (err) {
            console.error(err)
            res.status(400)
            next(err)
        }
    }
    // POST 
    async createOrder(req, res, next) {
        try {
            let { role, customerName, contactNumber, address, email, listProduct, bankPayment } = req.body;
            //get product by skucode
            let listCallApi = listProduct.map(async product => {
                let url = ApiUrl.getProductBySkuCode(product.productCode)
                let response = await KiotvietAPI.callApi(url)
                let price = role == 'Cộng tác viên' ? response.data.priceBooks[0].price : response.data.basePrice
                return {
                    productCode: product.productCode,
                    quantity: product.quantity,
                    price: price,
                }
            })
            listProduct =  await Promise.all(listCallApi)
            let order = await KiotVietOrder.createOrder(customerName, contactNumber, address, email, listProduct, bankPayment);
            res.json(baseRespond(true, AppString.ok, order))
        } catch (err) {
            res.status(400)
            res.json(baseRespond(false, err.message))
        }
    }
}

module.exports = new ApiController();