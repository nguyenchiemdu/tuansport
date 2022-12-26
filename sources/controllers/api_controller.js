const { json, response } = require("express");
const ApiUrl = require("../common/api_url");
const AppString = require("../common/app_string");
const { baseRespond } = require("../common/functions");
const KiotvietAPI = require("../common/kiotviet_api");
const { mapRangePrice } = require("../common/model_function");
const { getTableDataWithPagination } = require("../common/pagination");
const KiotVietOrder = require("../models/kiotviet/kiotviet.order");
const mongoCategory = require("../models/mongo/mongo.category");
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
            let userInfor = req.headers.userInfor;
            let doc = await mongoProduct.findOne({_id: req.params.id})
            let data = doc._doc;
            if (userInfor == null) {
                delete data.ctvPrice
            }
            res.json(baseRespond(true, AppString.ok, data))
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
    // GET get products that match the query parameters
    async getProducts(req,res) {
        try {
            let userInfor = req.headers.userInfor;
            let role = req.headers.userInfor?.role;
            let categoryId = req.query.categoryid
            let sizes = JSON.parse(req.query.sizes ?? '[]')
            let min = req.query.min
            let max = req.query.max
            // get all children of category
            let listCategoryid = []
            if (categoryId!= null) {
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
            }
            

            let findCondition = {
                masterProductId: null,
                isSynced: true,
                totalOnHand : { $gt: 0 }
            };
            if (categoryId!= null) findCondition['categoryId'] =  {
                                                    $in: listCategoryid
                                                    };
            if (sizes != null && sizes.length > 0) {
                findCondition = {
                    isSynced: true,
                    totalOnHand : { $gt: 0 }
            }
                let listSizeCondition = sizes.map(function(size){ return {listSize: size}})
                findCondition['$or'] = listSizeCondition;
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
            ////////////////////////////////
            let searchText = req.query.search;
            let newest = req.query.newest ?? false;
            let listFindBySeachKeyCondition = [
            ]
            if (searchText != null && searchText.length > 0) {
                listFindBySeachKeyCondition = [
                    { "name": { $regex: searchText, $options: 'i' }, masterProductId: null },
                    { "fullName": { $regex: searchText, $options: 'i' }, masterProductId: null },
                    { "skuCode": { $regex: searchText } }
                ]
            }
            if (listFindBySeachKeyCondition.length > 0) {
                findCondition['$or'] = listFindBySeachKeyCondition;
                delete findCondition.masterProductId;
            }
            let sortCondition = newest? '-updatedAt': ''
            ////////////////////////////////
            // console.log(JSON.stringify(findCondition))
            let response = await getTableDataWithPagination(req, mongoProduct, {
                findCondition: findCondition,
                sortCondition:sortCondition,
            })
            // remove ctvPrice if there is no user
            if (userInfor == null) 
                response.docs = response.docs.map((doc) =>{
                    doc = doc._doc
                    delete doc.ctvPrice
                    return doc
                })
            response.docs = await mapRangePrice(response.docs,req)
            res.json(baseRespond(true,AppString.ok,response))
        } catch (err){
            console.log(err)
            res.status(400)
            res.json(baseRespond(false, err))
        }
    }
}

module.exports = new ApiController();