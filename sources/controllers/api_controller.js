const { json, response } = require("express");
const ApiUrl = require("../common/api_url");
const AppString = require("../common/app_string");
const { baseRespond } = require("../common/functions");
const KiotvietAPI = require("../common/kiotviet_api");

class ApiController {
    tryApi(_, res) {
        let response = {"success": true,"message": "OK","data": ""};
        res.json(response);
        console.log(response)
    }
    // GET
    async  getProductByID(req,res,next) {
        try {
            let url = ApiUrl.getProductById(req.params.id)
            let response =  await KiotvietAPI.callApi(url)
            res.json(baseRespond(true,AppString.ok,response.data))
        } catch(err) {
            console.error(err)
            res.status(400)
            next(err)
        }
    }
    // GET
    async  getProductBySkuCode(req,res,next) {
        try {
            let url = ApiUrl.getProductBySkuCode(req.params.skucode)
            let response =  await KiotvietAPI.callApi(url)
            res.json(baseRespond(true,AppString.ok,response.data))
        } catch(err) {
            console.error(err)
            res.status(400)
            next(err)
        }
    }
}

module.exports = new ApiController();